// Aviso automático de registro incompleto (Requerimiento 003).
//
// Cuando un taller empieza el registro en la app y no lo termina, pasado un
// tiempo se avisa a un sistema externo (webhook) con su WhatsApp y el detalle
// de lo que le falta, para que puedan escribirle.
//
// Configuración (variables de entorno):
//   REGISTRO_INCOMPLETO_WEBHOOK_URL  → enlace que recibe el aviso. Sin esto no
//                                      se envía nada (la función queda inactiva).
//   REGISTRO_INCOMPLETO_MINUTOS      → espera desde la última actividad (60).
//   REGISTRO_INCOMPLETO_TOKEN        → opcional; viaja como "Authorization: Bearer".
//
// Datos: colección `RegistrosIncompletos`, un documento por borrador del
// teléfono. Se borra al completarse el registro y a los 30 días.

const axios = require('axios');
const { db } = require('../firebase');

const COLECCION = 'RegistrosIncompletos';
const TOTAL_PASOS = 4;
const MAX_INTENTOS = 5;
const DIAS_RETENCION = 30;

const webhookUrl = () => String(process.env.REGISTRO_INCOMPLETO_WEBHOOK_URL || '').trim();
const minutosEspera = () => {
  const n = Number(process.env.REGISTRO_INCOMPLETO_MINUTOS);
  return Number.isFinite(n) && n >= 5 ? n : 60;
};

const texto = (v, max = 160) => String(v == null ? '' : v).trim().slice(0, max);
const soloTelefono = (v) => String(v == null ? '' : v).replace(/[^\d+]/g, '').slice(0, 20);

/**
 * POST /api/usuarios/registroProgreso  (pública: el taller aún no tiene cuenta)
 * Body: { borradorId, paso, responsable, nombre, email, phone, whatsapp, faltantes[], completado }
 */
const guardarProgreso = async (req, res) => {
  try {
    const b = req.body || {};
    const borradorId = texto(b.borradorId, 64);
    if (!/^[A-Za-z0-9_-]{12,64}$/.test(borradorId)) {
      return res.status(400).send({ message: 'Identificador de borrador inválido.' });
    }
    const ref = db.collection(COLECCION).doc(borradorId);

    if (b.completado === true) {
      await ref.delete().catch(() => {});
      return res.status(200).send({ ok: true });
    }

    const whatsapp = soloTelefono(b.whatsapp || b.phone);
    const phone = soloTelefono(b.phone);
    // Sin un número no hay a quién escribirle: no se guarda nada.
    if (whatsapp.replace(/\D/g, '').length < 10) {
      return res.status(200).send({ ok: true, guardado: false });
    }

    const paso = Math.min(Math.max(parseInt(b.paso, 10) || 1, 1), TOTAL_PASOS);
    const faltantes = Array.isArray(b.faltantes)
      ? b.faltantes.map((x) => texto(x, 80)).filter(Boolean).slice(0, 30)
      : [];

    const ahora = new Date();
    const previo = await ref.get();
    await ref.set(
      {
        responsable: texto(b.responsable),
        nombre: texto(b.nombre),
        email: texto(b.email).toLowerCase(),
        phone,
        whatsapp,
        paso,
        faltantes,
        actualizadoEn: ahora,
        ...(previo.exists ? {} : { creadoEn: ahora, avisado: false, intentos: 0 }),
      },
      { merge: true },
    );
    return res.status(200).send({ ok: true, guardado: true });
  } catch (error) {
    console.error('registroProgreso:', error && error.message);
    // Nunca debe estorbar el registro en la app.
    return res.status(200).send({ ok: false });
  }
};

/** Al completarse un registro, se retiran sus borradores (por correo o teléfono). */
const marcarCompletado = async ({ email, phone }) => {
  try {
    const consultas = [];
    const correo = texto(email).toLowerCase();
    const tel = soloTelefono(phone);
    if (correo) consultas.push(db.collection(COLECCION).where('email', '==', correo).get());
    if (tel) consultas.push(db.collection(COLECCION).where('phone', '==', tel).get());
    const resultados = await Promise.all(consultas);
    const refs = new Map();
    resultados.forEach((snap) => snap.forEach((d) => refs.set(d.id, d.ref)));
    await Promise.all([...refs.values()].map((r) => r.delete()));
  } catch (error) {
    console.error('registroIncompleto.marcarCompletado:', error && error.message);
  }
};

const aFecha = (v) => (v && typeof v.toDate === 'function' ? v.toDate() : v instanceof Date ? v : null);

const cuerpoAviso = (id, d) => ({
  evento: 'registro_incompleto',
  borradorId: id,
  whatsapp: d.whatsapp,
  telefono: d.phone || d.whatsapp,
  responsable: d.responsable || '',
  nombreNegocio: d.nombre || '',
  correo: d.email || '',
  pasoActual: d.paso,
  totalPasos: TOTAL_PASOS,
  faltantes: d.faltantes || [],
  iniciadoEn: aFecha(d.creadoEn) ? aFecha(d.creadoEn).toISOString() : null,
  ultimaActividad: aFecha(d.actualizadoEn) ? aFecha(d.actualizadoEn).toISOString() : null,
});

/** Tarea programada: avisa de los borradores sin actividad y limpia los viejos. */
const revisarRegistrosIncompletos = async () => {
  const url = webhookUrl();
  const ahora = Date.now();
  const resumen = { avisados: 0, fallidos: 0, borrados: 0, activo: Boolean(url) };

  try {
    // Limpieza: nada se conserva más de DIAS_RETENCION días.
    const viejos = await db
      .collection(COLECCION)
      .where('actualizadoEn', '<=', new Date(ahora - DIAS_RETENCION * 86400000))
      .limit(100)
      .get();
    await Promise.all(viejos.docs.map((d) => d.ref.delete()));
    resumen.borrados = viejos.size;

    if (!url) return resumen;

    const limite = ahora - minutosEspera() * 60000;
    const pendientes = await db.collection(COLECCION).where('avisado', '==', false).limit(100).get();

    for (const doc of pendientes.docs) {
      const d = doc.data();
      const ultima = aFecha(d.actualizadoEn);
      if (!ultima || ultima.getTime() > limite) continue; // aún puede estar completándolo
      if ((d.intentos || 0) >= MAX_INTENTOS) continue;

      try {
        const token = String(process.env.REGISTRO_INCOMPLETO_TOKEN || '').trim();
        await axios.post(url, cuerpoAviso(doc.id, d), {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        await doc.ref.set({ avisado: true, avisadoEn: new Date() }, { merge: true });
        resumen.avisados += 1;
      } catch (error) {
        await doc.ref.set({ intentos: (d.intentos || 0) + 1 }, { merge: true });
        resumen.fallidos += 1;
        console.error('registroIncompleto: webhook falló:', error && error.message);
      }
    }
  } catch (error) {
    console.error('revisarRegistrosIncompletos:', error && error.message);
  }
  return resumen;
};

module.exports = {
  guardarProgreso,
  marcarCompletado,
  revisarRegistrosIncompletos,
  cuerpoAviso,
};
