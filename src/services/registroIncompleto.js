// Aviso automático de registro incompleto (Requerimiento 003).
//
// Cuando un taller empieza el registro en la app y no lo termina, pasado un
// tiempo se avisa a un sistema externo (webhook) con su WhatsApp y el detalle
// de lo que le falta, para que puedan escribirle.
//
// Destino: el webhook de iaolivia (n8n), que redacta y envía el WhatsApp.
//   POST { telefono, campos_faltantes[], nombre_responsable, nombre_negocio, paso_actual }
//   200 si lo recibió; 400 con el detalle si falta algo.
//
// Configuración (variables de entorno, todas opcionales):
//   REGISTRO_INCOMPLETO_WEBHOOK_URL  → cambia el enlace de destino.
//   REGISTRO_INCOMPLETO_ACTIVO=0     → apaga el envío (la app sigue guardando).
//   REGISTRO_INCOMPLETO_MINUTOS      → espera desde la última actividad (60).
//   REGISTRO_INCOMPLETO_TOKEN        → cuando pidan el header de seguridad.
//   REGISTRO_INCOMPLETO_HEADER       → nombre de ese header (por defecto
//                                      "Authorization", con "Bearer <token>").
//
// Datos: colección `RegistrosIncompletos`, un documento por borrador del
// teléfono. Se borra al completarse el registro y a los 30 días.

const axios = require('axios');
const { db } = require('../firebase');

const COLECCION = 'RegistrosIncompletos';
const TOTAL_PASOS = 3; // Req. 005: registro en 3 pasos
const MAX_INTENTOS = 5;
const DIAS_RETENCION = 30;

const WEBHOOK_POR_DEFECTO = 'https://n8n.iaolivia.com/webhook/solvers-registro-incompleto';
const webhookUrl = () => {
  if (String(process.env.REGISTRO_INCOMPLETO_ACTIVO || '').trim() === '0') return '';
  return String(process.env.REGISTRO_INCOMPLETO_WEBHOOK_URL || WEBHOOK_POR_DEFECTO).trim();
};

// La app informa lo que falta con las etiquetas que ve el taller. El webhook
// reconoce estos códigos y los convierte en frases; lo que no reconoce lo
// repite tal cual, así que para el resto se envía ya una frase legible.
const CAMPO_WEBHOOK = {
  'documento: rif': 'foto_rif',
  'documento: frente del taller': 'foto_externa',
  'documento: interior del taller': 'foto_interna',
  'documento: logo del negocio': 'logo',
  'dirección': 'direccion',
  'servicios que ofrece': 'servicios',
  'número de rif': 'el número de RIF',
  'nombre del taller': 'el nombre del negocio',
  'estado': 'el estado donde está el taller',
  'ubicación en el mapa': 'la ubicación en el mapa',
  'nombre del responsable': 'el nombre del responsable',
  'correo': 'el correo',
  // ya no se piden en el registro o no tiene sentido recordarlos
  'horario de atención': null,
  'teléfono': null,
  'whatsapp': null,
  'contraseña': null,
};

const camposParaWebhook = (faltantes) => {
  const salida = [];
  (Array.isArray(faltantes) ? faltantes : []).forEach((f) => {
    const clave = String(f || '').trim().toLowerCase();
    if (!clave) return;
    const campo = clave in CAMPO_WEBHOOK ? CAMPO_WEBHOOK[clave] : String(f).trim();
    if (campo && !salida.includes(campo)) salida.push(campo);
  });
  // El webhook rechaza la lista vacía: si llenó todo y solo falta enviar, se dice eso.
  return salida.length ? salida : ['terminar y enviar el registro'];
};
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

// Formato acordado con iaolivia. Obligatorios: telefono y campos_faltantes.
const cuerpoAviso = (id, d) => ({
  telefono: d.whatsapp || d.phone,
  campos_faltantes: camposParaWebhook(d.faltantes),
  nombre_responsable: d.responsable || '',
  nombre_negocio: d.nombre || '',
  paso_actual: d.paso,
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
            ...(token
              ? process.env.REGISTRO_INCOMPLETO_HEADER
                ? { [process.env.REGISTRO_INCOMPLETO_HEADER]: token }
                : { Authorization: `Bearer ${token}` }
              : {}),
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
  camposParaWebhook,
};
