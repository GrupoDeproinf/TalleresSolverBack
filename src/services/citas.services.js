// Citas: el conductor reserva día y hora en un taller; el taller confirma,
// reprograma o completa; ambos reciben avisos y un recordatorio 24 h antes.
// (Propuesta de mejora, sección 4: "Cita: servicio, día, hora y vehículo en
// una sola pantalla; confirmación inmediata, recordatorio 24 h antes y opción
// de reprogramar".)
//
// Colección Firestore `Citas`:
//   uid_usuario, nombre_usuario, phone_usuario
//   uid_taller, nombre_taller
//   uid_servicio, nombre_servicio
//   vehiculo {id, marca, modelo, placa}
//   fecha "YYYY-MM-DD" y hora "HH:mm" en hora de Venezuela
//   inicio (Timestamp UTC, para ordenar y para el recordatorio)
//   estado: pendiente | confirmada | cancelada | rechazada | completada
//   nota, motivo, historial[], recordatorio_24h (bool), creada, actualizada
//
// Todas las fechas se calculan en hora de Venezuela (UTC-4, sin horario de
// verano): el servidor corre en UTC.

const admin = require("firebase-admin");
const { db } = require("../firebase");
const { MODO } = require("../middlewares/auth");

const COL = "Citas";
const OFFSET_VE_HORAS = 4; // Caracas = UTC-4
const CUPO_POR_HORA = 2; // autos por hora si el taller no configuró `cupo_por_hora`
const DIAS_RESERVABLES = 14;
const ANTICIPACION_MIN = 60; // no se reserva para dentro de menos de 1 h
const ACTIVAS = ["pendiente", "confirmada"];
const DIAS = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

// ── Fechas en hora de Venezuela ─────────────────────────────────────────────
const inicioUTC = (fecha, hora) => {
  const [y, m, d] = String(fecha).split("-").map(Number);
  const [hh, mm] = String(hora).split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh + OFFSET_VE_HORAS, mm || 0));
};
const ahoraVE = () => new Date(Date.now() - OFFSET_VE_HORAS * 3600 * 1000);
const hoyVE = () => ahoraVE().toISOString().slice(0, 10);
const diaSemana = (fecha) => {
  const [y, m, d] = fecha.split("-").map(Number);
  return DIAS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
};
const fechaValida = (f) => /^\d{4}-\d{2}-\d{2}$/.test(String(f || ""));
const horaValida = (h) => /^\d{2}:\d{2}$/.test(String(h || ""));
const minutos = (h) => {
  const m = String(h || "").match(/^(\d{1,2}):(\d{2})/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};
const sumarDias = (fecha, n) => {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};

const normalizarDia = (k) =>
  String(k || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

const leerHorario = (taller) => {
  let h = taller?.horarios_atencion;
  if (typeof h === "string") {
    try {
      h = JSON.parse(h);
    } catch (e) {
      h = null;
    }
  }
  if (!h || typeof h !== "object") return null;
  return Object.entries(h).reduce((acc, [k, v]) => ({ ...acc, [normalizarDia(k)]: v }), {});
};

/** Horas en punto dentro del horario del día ("08:00", "09:00"… hasta 1 h antes del cierre). */
const horasDelDia = (taller, fecha) => {
  const h = leerHorario(taller);
  const slot = h && h[diaSemana(fecha)];
  if (!slot || slot.enabled !== true) return [];
  const abre = minutos(slot.open);
  const cierra = minutos(slot.close);
  if (abre == null || cierra == null || cierra <= abre) return [];
  const out = [];
  for (let t = Math.ceil(abre / 60) * 60; t + 60 <= cierra; t += 60) {
    out.push(`${String(t / 60).padStart(2, "0")}:00`);
  }
  return out;
};

// ── Identidad ───────────────────────────────────────────────────────────────
// Con sesión se usa el uid verificado. En modo report/off (transición) se
// acepta el uid del body para no romper a nadie mientras se actualiza la app.
const quien = (req, campo) => {
  if (req.sesion?.uid) return req.sesion.uid;
  if (MODO === "enforce") return null;
  return req.body?.[campo] || null;
};
const esStaff = (req) => ["Admin", "Certificador"].includes(req.sesion?.rol);

// ── Push ────────────────────────────────────────────────────────────────────
const avisar = async (uid, title, body, secretCode, citaId) => {
  try {
    if (!uid) return;
    const d = await db.collection("Usuarios").doc(String(uid)).get();
    const token = d.exists ? d.data()?.token : null;
    if (!token) return;
    await admin.messaging().send({
      token,
      notification: { title, body },
      data: { secretCode, screen: secretCode === "CitaNueva" || secretCode === "CitaCanceladaPorConductor" ? "AgendaTaller" : "MisCitas", citaId: String(citaId || "") },
    });
  } catch (e) {
    console.warn("[citas] push:", e.message);
  }
};

const hora12 = (hhmm) => {
  const m = minutos(hhmm);
  if (m == null) return hhmm;
  const h = Math.floor(m / 60);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m % 60).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
};
const fechaLarga = (fecha) => {
  const [y, m, d] = fecha.split("-").map(Number);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const dia = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"][new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${dia} ${d} ${meses[m - 1]}`;
};
const cuando = (c) => `${fechaLarga(c.fecha)} a las ${hora12(c.hora)}`;

// ── Ocupación ───────────────────────────────────────────────────────────────
const ocupacion = async (uid_taller, fecha, excluirId) => {
  const snap = await db
    .collection(COL)
    .where("uid_taller", "==", String(uid_taller))
    .where("fecha", "==", fecha)
    .get();
  const porHora = {};
  snap.docs.forEach((doc) => {
    const c = doc.data();
    if (doc.id === excluirId || !ACTIVAS.includes(c.estado)) return;
    porHora[c.hora] = (porHora[c.hora] || 0) + 1;
  });
  return porHora;
};

const leerTaller = async (uid) => {
  const d = await db.collection("Usuarios").doc(String(uid)).get();
  return d.exists ? d.data() : null;
};

const horasLibres = async (taller, uid_taller, fecha, excluirId) => {
  const cupo = Number(taller?.cupo_por_hora) > 0 ? Number(taller.cupo_por_hora) : CUPO_POR_HORA;
  const ocupadas = await ocupacion(uid_taller, fecha, excluirId);
  const limite = Date.now() + ANTICIPACION_MIN * 60 * 1000;
  return horasDelDia(taller, fecha).map((hora) => ({
    hora,
    libre: (ocupadas[hora] || 0) < cupo && inicioUTC(fecha, hora).getTime() > limite,
  }));
};

// ── Endpoints ───────────────────────────────────────────────────────────────

/** Días reservables (próximos 14) con horas libres. Body: { uid_taller, fecha? } */
const disponibilidad = async (req, res) => {
  try {
    const { uid_taller, fecha, excluir } = req.body || {};
    if (!uid_taller) return res.status(400).json({ message: "Falta el taller." });
    const taller = await leerTaller(uid_taller);
    if (!taller) return res.status(404).json({ message: "No encontramos el taller." });
    const fechas = fechaValida(fecha)
      ? [fecha]
      : Array.from({ length: DIAS_RESERVABLES }, (_, i) => sumarDias(hoyVE(), i));
    const dias = [];
    for (const f of fechas) {
      const horas = await horasLibres(taller, uid_taller, f, excluir);
      dias.push({ fecha: f, horas, abierto: horas.length > 0, hayCupo: horas.some((h) => h.libre) });
    }
    return res.status(200).json({ dias, sinHorario: !leerHorario(taller) });
  } catch (e) {
    console.error("[citas/disponibilidad]", e);
    return res.status(500).json({ message: "No pudimos consultar la disponibilidad." });
  }
};

/** Body: { uid_taller, uid_servicio, nombre_servicio, fecha, hora, vehiculo, nota, uid_usuario (transición) } */
const crear = async (req, res) => {
  try {
    const b = req.body || {};
    const uid_usuario = quien(req, "uid_usuario");
    if (!uid_usuario) return res.status(401).json({ message: "Inicia sesión para reservar.", codigo: "SIN_SESION" });
    if (!b.uid_taller || !fechaValida(b.fecha) || !horaValida(b.hora)) {
      return res.status(400).json({ message: "Elige el día y la hora de la cita." });
    }
    const [taller, usuario] = await Promise.all([leerTaller(b.uid_taller), leerTaller(uid_usuario)]);
    if (!taller) return res.status(404).json({ message: "No encontramos el taller." });

    const horas = await horasLibres(taller, b.uid_taller, b.fecha);
    const slot = horas.find((h) => h.hora === b.hora);
    if (!slot) return res.status(409).json({ message: "El taller no atiende a esa hora. Elige otra.", codigo: "FUERA_DE_HORARIO" });
    if (!slot.libre) return res.status(409).json({ message: "Esa hora se acaba de ocupar. Elige otra.", codigo: "OCUPADO" });

    // Una cita activa por conductor y taller el mismo día.
    const dup = await db.collection(COL).where("uid_usuario", "==", uid_usuario).where("fecha", "==", b.fecha).get();
    if (dup.docs.some((d) => d.data().uid_taller === b.uid_taller && ACTIVAS.includes(d.data().estado))) {
      return res.status(409).json({ message: "Ya tienes una cita con este taller ese día.", codigo: "DUPLICADA" });
    }

    const v = b.vehiculo || {};
    const ahora = admin.firestore.FieldValue.serverTimestamp();
    const cita = {
      uid_usuario,
      nombre_usuario: usuario?.nombre || usuario?.Nombre || b.nombre_usuario || "",
      phone_usuario: usuario?.phone || "",
      uid_taller: String(b.uid_taller),
      nombre_taller: taller.nombre || taller.nombre_taller || "",
      phone_taller: taller.whatsapp || taller.phone || "",
      uid_servicio: b.uid_servicio || "",
      nombre_servicio: String(b.nombre_servicio || "").slice(0, 120),
      vehiculo: {
        id: v.id || v.uid || "",
        marca: v.vehiculo_marca || v.marca || "",
        modelo: v.vehiculo_modelo || v.modelo || "",
        placa: String(v.vehiculo_placa || v.placa || "").toUpperCase(),
      },
      fecha: b.fecha,
      hora: b.hora,
      inicio: admin.firestore.Timestamp.fromDate(inicioUTC(b.fecha, b.hora)),
      estado: "pendiente",
      nota: String(b.nota || "").slice(0, 300),
      motivo: "",
      recordatorio_24h: false,
      historial: [{ estado: "pendiente", por: "conductor", en: new Date().toISOString() }],
      creada: ahora,
      actualizada: ahora,
    };
    const ref = await db.collection(COL).add(cita);
    await avisar(
      cita.uid_taller,
      "Nueva cita por confirmar",
      `${cita.nombre_usuario || "Un conductor"} reservó ${cita.nombre_servicio || "una cita"} para el ${cuando(cita)}. Confírmala en tu agenda.`,
      "CitaNueva",
      ref.id,
    );
    return res.status(201).json({ id: ref.id, ...cita, creada: null, actualizada: null });
  } catch (e) {
    console.error("[citas/crear]", e);
    return res.status(500).json({ message: "No pudimos crear la cita. Intenta de nuevo." });
  }
};

const serializar = (doc) => {
  const c = doc.data();
  return {
    id: doc.id,
    ...c,
    inicio: c.inicio?.toDate ? c.inicio.toDate().toISOString() : null,
    creada: c.creada?.toDate ? c.creada.toDate().toISOString() : null,
    actualizada: c.actualizada?.toDate ? c.actualizada.toDate().toISOString() : null,
  };
};

/** Citas del conductor. Body: { uid_usuario (transición) } */
const misCitas = async (req, res) => {
  try {
    const uid = quien(req, "uid_usuario");
    if (!uid) return res.status(401).json({ message: "Inicia sesión.", codigo: "SIN_SESION" });
    const snap = await db.collection(COL).where("uid_usuario", "==", uid).get();
    const citas = snap.docs.map(serializar).sort((a, b) => String(a.inicio).localeCompare(String(b.inicio)));
    return res.status(200).json({ citas });
  } catch (e) {
    console.error("[citas/misCitas]", e);
    return res.status(500).json({ message: "No pudimos cargar tus citas." });
  }
};

/** Agenda del taller. Body: { uid_taller (transición), desde? "YYYY-MM-DD" } */
const agendaTaller = async (req, res) => {
  try {
    const uid = esStaff(req) && req.body?.uid_taller ? req.body.uid_taller : quien(req, "uid_taller");
    if (!uid) return res.status(401).json({ message: "Inicia sesión.", codigo: "SIN_SESION" });
    const desde = fechaValida(req.body?.desde) ? req.body.desde : sumarDias(hoyVE(), -7);
    const snap = await db.collection(COL).where("uid_taller", "==", String(uid)).get();
    const citas = snap.docs
      .map(serializar)
      .filter((c) => c.fecha >= desde)
      .sort((a, b) => String(a.inicio).localeCompare(String(b.inicio)));
    return res.status(200).json({ citas });
  } catch (e) {
    console.error("[citas/agendaTaller]", e);
    return res.status(500).json({ message: "No pudimos cargar la agenda." });
  }
};

// Qué puede hacer cada parte y a qué estado lleva.
const ACCIONES = {
  conductor: {
    cancelar: { desde: ["pendiente", "confirmada"], a: "cancelada" },
    reprogramar: { desde: ["pendiente", "confirmada"], a: "pendiente" },
  },
  taller: {
    confirmar: { desde: ["pendiente"], a: "confirmada" },
    rechazar: { desde: ["pendiente"], a: "rechazada" },
    reprogramar: { desde: ["pendiente", "confirmada"], a: "confirmada" },
    cancelar: { desde: ["confirmada"], a: "cancelada" },
    completar: { desde: ["confirmada"], a: "completada" },
  },
};

/** Body: { id, accion, fecha?, hora?, motivo?, uid (transición) } */
const actualizar = async (req, res) => {
  try {
    const { id, accion, fecha, hora, motivo } = req.body || {};
    if (!id || !accion) return res.status(400).json({ message: "Falta la cita o la acción." });
    const ref = db.collection(COL).doc(String(id));
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ message: "No encontramos la cita." });
    const c = doc.data();

    const uid = quien(req, "uid");
    const rol = esStaff(req) ? "taller" : uid === c.uid_taller ? "taller" : uid === c.uid_usuario ? "conductor" : null;
    if (!rol) return res.status(403).json({ message: "Esta cita no es tuya.", codigo: "SIN_PERMISO" });
    const regla = ACCIONES[rol][accion];
    if (!regla) return res.status(400).json({ message: "Esa acción no está disponible." });
    if (!regla.desde.includes(c.estado)) {
      return res.status(409).json({ message: `La cita ya está ${c.estado}.`, codigo: "ESTADO" });
    }

    const cambios = {
      estado: regla.a,
      actualizada: admin.firestore.FieldValue.serverTimestamp(),
      motivo: String(motivo || "").slice(0, 300),
      historial: admin.firestore.FieldValue.arrayUnion({ estado: regla.a, accion, por: rol, en: new Date().toISOString() }),
    };

    if (accion === "reprogramar") {
      if (!fechaValida(fecha) || !horaValida(hora)) return res.status(400).json({ message: "Elige el nuevo día y hora." });
      const taller = await leerTaller(c.uid_taller);
      const libres = await horasLibres(taller, c.uid_taller, fecha, doc.id);
      const s = libres.find((h) => h.hora === hora);
      if (!s || !s.libre) return res.status(409).json({ message: "Esa hora no está disponible. Elige otra.", codigo: "OCUPADO" });
      Object.assign(cambios, {
        fecha,
        hora,
        inicio: admin.firestore.Timestamp.fromDate(inicioUTC(fecha, hora)),
        recordatorio_24h: false,
      });
    }
    await ref.update(cambios);
    const nueva = { ...c, ...cambios, fecha: cambios.fecha || c.fecha, hora: cambios.hora || c.hora };

    // Aviso a la otra parte.
    const servicio = c.nombre_servicio || "tu cita";
    const avisos = {
      "taller:confirmar": [c.uid_usuario, "Cita confirmada ✅", `${c.nombre_taller} te espera el ${cuando(nueva)} para ${servicio}.`, "CitaConfirmada"],
      "taller:rechazar": [c.uid_usuario, "El taller no puede atenderte", `${c.nombre_taller} no puede recibirte el ${cuando(c)}.${cambios.motivo ? ` Motivo: ${cambios.motivo}` : ""} Puedes reservar otra hora.`, "CitaRechazada"],
      "taller:reprogramar": [c.uid_usuario, "Tu cita cambió de hora", `${c.nombre_taller} movió tu cita al ${cuando(nueva)}.`, "CitaReprogramada"],
      "taller:cancelar": [c.uid_usuario, "Cita cancelada", `${c.nombre_taller} canceló tu cita del ${cuando(c)}.${cambios.motivo ? ` Motivo: ${cambios.motivo}` : ""}`, "CitaCancelada"],
      "taller:completar": [c.uid_usuario, "¿Cómo te fue?", `Cuéntanos cómo te atendió ${c.nombre_taller}. Tu opinión ayuda a otros conductores.`, "CitaCompletada"],
      "conductor:cancelar": [c.uid_taller, "Cita cancelada", `${c.nombre_usuario || "El conductor"} canceló su cita del ${cuando(c)}.`, "CitaCanceladaPorConductor"],
      "conductor:reprogramar": [c.uid_taller, "Cita reprogramada: confírmala", `${c.nombre_usuario || "El conductor"} movió su cita al ${cuando(nueva)}.`, "CitaNueva"],
    }[`${rol}:${accion}`];
    if (avisos) await avisar(...avisos, doc.id);

    return res.status(200).json({ id: doc.id, estado: regla.a, fecha: nueva.fecha, hora: nueva.hora });
  } catch (e) {
    console.error("[citas/actualizar]", e);
    return res.status(500).json({ message: "No pudimos actualizar la cita. Intenta de nuevo." });
  }
};

/**
 * Cron cada hora: recordatorio a las citas confirmadas que empiezan en 23–25 h.
 * La ventana de 2 h cubre retrasos del cron sin duplicar (se marca
 * recordatorio_24h).
 */
const jobRecordatorios24h = async () => {
  try {
    const desde = admin.firestore.Timestamp.fromMillis(Date.now() + 23 * 3600 * 1000);
    const hasta = admin.firestore.Timestamp.fromMillis(Date.now() + 25 * 3600 * 1000);
    const snap = await db.collection(COL).where("inicio", ">=", desde).where("inicio", "<=", hasta).get();
    let enviados = 0;
    for (const doc of snap.docs) {
      const c = doc.data();
      if (c.estado !== "confirmada" || c.recordatorio_24h) continue;
      await avisar(c.uid_usuario, "Tu cita es mañana", `${c.nombre_servicio || "Tu cita"} en ${c.nombre_taller}, ${cuando(c)}. Si no puedes ir, reprográmala desde la app.`, "CitaRecordatorio", doc.id);
      await avisar(c.uid_taller, "Cita mañana", `${c.nombre_usuario || "Un conductor"} viene el ${cuando(c)} para ${c.nombre_servicio || "su cita"}.`, "CitaRecordatorioTaller", doc.id);
      await doc.ref.update({ recordatorio_24h: true });
      enviados += 1;
    }
    if (enviados) console.log(`[citas] recordatorios 24 h enviados: ${enviados}`);
  } catch (e) {
    console.error("[citas] jobRecordatorios24h:", e.message);
  }
};

module.exports = {
  disponibilidad,
  crear,
  misCitas,
  agendaTaller,
  actualizar,
  jobRecordatorios24h,
  // Para pruebas
  _internas: { horasDelDia, inicioUTC, diaSemana, ACCIONES, hora12, cuando },
};
