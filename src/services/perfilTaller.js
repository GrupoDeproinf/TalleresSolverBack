// Edición del perfil del negocio desde la app (observación 3).
//
// El editor antiguo enviaba el perfil completo a UpdateTallerUsuarioDocs, que
// guarda cualquier campo recibido y deja vacíos los documentos que no llegan.
// Este punto solo acepta los campos del perfil y solo guarda los que vienen:
// no puede tocar documentos, estatus, plan ni correo.

const { db } = require('../firebase');

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const METODOS = ['efectivo', 'pagoMovil', 'puntoVenta', 'transferencia', 'tarjetaCreditoN', 'tarjetaCreditoI', 'zelle', 'zinli'];
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

const texto = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
const telefono = (v) => String(v == null ? '' : v).replace(/[^\d+]/g, '').slice(0, 20);

/** Devuelve { cambios } con lo válido, o { error } con el primer problema. */
const validarCambios = (b) => {
  const c = {};

  if (b.nombre !== undefined) {
    const v = texto(b.nombre, 80);
    if (v.length < 3) return { error: 'Escribe el nombre del taller.' };
    c.nombre = v;
  }
  if (b.Caracteristicas !== undefined) c.Caracteristicas = texto(b.Caracteristicas, 400);
  if (b.responsable !== undefined) c.responsable = texto(b.responsable, 80);

  for (const campo of ['phone', 'whatsapp']) {
    if (b[campo] === undefined) continue;
    const v = telefono(b[campo]);
    if (v.replace(/\D/g, '').length < 10) return { error: 'Revisa el número de teléfono.' };
    c[campo] = v;
  }

  // Req. 005: el perfil maneja un solo número. Si cambia el teléfono y no se
  // envía un WhatsApp aparte, el WhatsApp del taller pasa a ser ese mismo.
  if (c.phone && c.whatsapp === undefined) c.whatsapp = c.phone;

  if (b.estado !== undefined) {
    const v = texto(b.estado, 40);
    if (!v) return { error: 'Elige el estado donde está el taller.' };
    c.estado = v;
  }
  if (b.Direccion !== undefined) {
    const v = texto(b.Direccion, 240);
    if (v.length < 8) return { error: 'Escribe la dirección con una referencia.' };
    c.Direccion = v;
  }

  if (b.lat !== undefined || b.lng !== undefined) {
    const lat = Number(b.lat);
    const lng = Number(b.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return { error: 'La ubicación del mapa no es válida.' };
    }
    c.lat = lat;
    c.lng = lng;
    c.ubicacion = { lat, lng };
  }

  if (b.horarios_atencion !== undefined) {
    const h = b.horarios_atencion;
    if (!h || typeof h !== 'object' || Array.isArray(h)) return { error: 'El horario no es válido.' };
    const limpio = {};
    for (const d of DIAS) {
      const x = h[d] || {};
      const open = HORA.test(x.open) ? x.open : '08:00';
      const close = HORA.test(x.close) ? x.close : '17:00';
      const enabled = x.enabled === true;
      if (enabled && open >= close) return { error: 'Hay un día que cierra antes de abrir: revisa las horas.' };
      limpio[d] = { enabled, open, close };
    }
    if (!DIAS.some((d) => limpio[d].enabled)) return { error: 'Elige al menos un día de atención.' };
    c.horarios_atencion = limpio;
  }

  if (b.metodos_pago !== undefined) {
    const m = b.metodos_pago;
    if (!m || typeof m !== 'object' || Array.isArray(m)) return { error: 'Los métodos de pago no son válidos.' };
    c.metodos_pago = METODOS.reduce((acc, k) => ({ ...acc, [k]: m[k] === true }), {});
  }

  return { cambios: c };
};

/** POST /api/usuarios/actualizarPerfilTaller  Body: { uid, ...campos que cambiaron } */
const actualizarPerfilTaller = async (req, res) => {
  try {
    const b = req.body || {};
    const uid = texto(b.uid, 128);
    if (!uid) return res.status(400).send({ message: 'El UID es obligatorio.' });

    const { cambios, error } = validarCambios(b);
    if (error) return res.status(400).send({ message: error });
    if (!Object.keys(cambios).length) return res.status(200).send({ message: 'Sin cambios.', cambios: [] });

    const ref = db.collection('Usuarios').doc(uid);
    const snap = await ref.get();
    if (!snap.exists || (snap.data() || {}).typeUser !== 'Taller') {
      return res.status(404).send({ message: 'No encontramos el negocio.' });
    }

    await ref.set({ ...cambios, perfilActualizadoEn: new Date() }, { merge: true });
    return res.status(200).send({ message: 'Perfil actualizado.', cambios: Object.keys(cambios) });
  } catch (error) {
    console.error('actualizarPerfilTaller:', error && error.message);
    return res.status(500).send({ message: 'No pudimos guardar los cambios.' });
  }
};

module.exports = { actualizarPerfilTaller, validarCambios };
