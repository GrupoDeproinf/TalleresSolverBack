// Seguridad de la API: quién puede llamar a cada ruta.
//
// Antes cualquiera que conociera la URL podía aprobar un taller, borrar
// cuentas, editar perfiles ajenos o mandar notificaciones push a cualquiera.
//
// Cómo funciona:
// 1. Al iniciar sesión (/usuarios/authenticateUser) el servidor devuelve un
//    `customToken` de Firebase. La app abre con él una sesión de Firebase Auth
//    y manda en cada llamada `Authorization: Bearer <ID token>`, que Firebase
//    renueva solo.
// 2. Este middleware verifica ese token (firebase-admin) y averigua el rol:
//    Cliente / Taller (colección Usuarios) o Admin (colección Admins).
// 3. Cada ruta tiene una regla en POLITICA (abajo).
//
// Modo (variable de entorno AUTH_MODE):
//   off     → no verifica nada (comportamiento anterior).
//   report  → (por defecto) verifica y deja pasar TODO, pero registra en el
//             log cada llamada que en modo enforce se bloquearía. Sirve para
//             ver qué falta (versiones viejas de la app, el panel) antes de
//             cerrar.
//   enforce → bloquea con 401/403 lo que no cumple la regla.

const { admin, db } = require('../firebase');

const MODO = String(process.env.AUTH_MODE || 'report').toLowerCase();

// ── Reglas por ruta ─────────────────────────────────────────────────────────
// public  → sin sesión (entrar, registrarse, catálogo público).
// auth    → cualquier usuario con sesión.
// owner   → con sesión y el campo indicado del body es su propio uid
//           (los admin pueden siempre).
// admin   → solo personal de Solvers (Admin o Certificador).
const P = 'public';
const AUTH = 'auth';
const ADMIN = 'admin';
const owner = (...campos) => ({ owner: campos });

const POLITICA = {
  // /api/usuarios
  '/usuarios/authenticateUser': P,
  '/usuarios/SaveClient': P,
  '/usuarios/SaveClientGoogle': P,
  '/usuarios/SaveTaller': P,
  '/usuarios/SaveTallerExtended': P,
  '/usuarios/validarRifDocumento': P, // se usa durante el registro, aún sin sesión
  '/usuarios/registroProgreso': P, // avance del registro, aún sin cuenta
  '/usuarios/restorePass': P,
  '/usuarios/getActiveCategories': P,
  '/usuarios/getSubcategoriesByCategoryUid': P,
  '/usuarios/getPlanes': P,
  '/usuarios/tasaBcv': P, // dato público del BCV
  '/usuarios/getMetodosPago': P,
  '/usuarios/getTiposVehiculo': P,
  '/usuarios/getServiceByUid': P,
  '/usuarios/getServicesByTalleruid': P,
  '/usuarios/getServicesByTallerUidTrue': P,
  '/usuarios/getUserByUid': P, // se limpia en la respuesta (ver limpiarUsuarioPublico)
  '/usuarios/nearby': P,
  '/usuarios/getNearbyWithCategories': P,
  // Se llama al final del registro, antes de iniciar sesión: ver reglaAsociarPlan.
  '/usuarios/AsociarPlan': { custom: 'asociarPlan' },

  '/usuarios/getVehiculosByUsuarioUid': owner('uid'),
  '/usuarios/saveUpdateNotificationUser': owner('uiduser'),
  '/usuarios/updateNotificationUser': owner('uiduser'),
  '/usuarios/deleteVehiculo': owner('uiduser'),
  '/usuarios/updateVehiculoKm': owner('uid_user'),
  '/usuarios/saveOrUpdateVehiculo': AUTH,
  '/usuarios/deleteUserFromAuth': owner('uid'),
  '/usuarios/UpdateClient': owner('uid'),
  '/usuarios/UpdateTaller': owner('uid'),
  '/usuarios/actualizarPerfilTaller': owner('uid'),
  '/usuarios/resumenTaller': owner('uid'),
  '/usuarios/SaveTallerAll': owner('uid'),
  '/usuarios/UpdateUsuariosAll': owner('uid'),
  '/usuarios/UpdateTallerUsuarioDocs': AUTH,
  '/usuarios/updateUsuarioDocumentacionConductor': AUTH,
  '/usuarios/ReportarPagoData': owner('uid'),
  '/usuarios/saveSolicitud': owner('uid_usuario'),
  '/usuarios/getSolicitudesByUsuario': owner('uid_usuario'),
  '/usuarios/getSolicitudesByUsuarioAndStatus': owner('uid_taller'),
  '/usuarios/getPropuestasByStatus': owner('uid_taller'),
  '/usuarios/getSolicitudByServicioUid': AUTH,
  '/usuarios/getPropuestasBySolicitud': AUTH,
  '/usuarios/savePropuesta': AUTH,
  '/usuarios/updateSolicitudStatus': AUTH,
  '/usuarios/updatePropuesta': AUTH,
  '/usuarios/updateScheduleDate': AUTH,
  '/usuarios/saveOrUpdateService': AUTH,
  '/usuarios/deleteService': owner('uid_taller'),
  '/usuarios/getNotificaciones': AUTH,
  // Push: con `uid_destino` el servidor busca el token (lo normal). Mandar un
  // `token` crudo queda solo para administradores (ver reglaSendNotification).
  '/usuarios/sendNotification': { custom: 'sendNotification' },
  '/usuarios/notificarCertificadores': AUTH,

  '/usuarios/actualizarStatusUsuario': ADMIN,
  '/usuarios/GetUsers': ADMIN,
  '/usuarios/getTalleres': ADMIN,
  '/usuarios/asociarCategoriasDesdeServicios': ADMIN,

  // /api/home
  '/home/getServices': P,
  '/home/getServicesByCategory': P,
  '/home/getServiciosPaginados': P,
  '/home/getSubscriptionById': AUTH,
  '/home/getProductsByCategory': P,
  '/home/getCommentsByService': P,
  '/home/getCommentsByTaller': P,
  '/home/validatePhone': P,
  '/home/validateEmail': P,
  '/home/savePerfilView': P,
  '/home/saveServiceContactView': P,
  '/home/contactService': P,
  '/home/getContactService': ADMIN,
  '/home/addCommentToService': AUTH,
  '/home/addCommentToTaller': AUTH,
  '/home/notificarContactoTaller': AUTH,

  // /api/citas: la regla fina (dueño de la cita) la aplica citas.services.
  '/citas/disponibilidad': P,
  '/citas/crear': AUTH,
  '/citas/misCitas': AUTH,
  '/citas/agendaTaller': AUTH,
  '/citas/actualizar': AUTH,

  // /api/distance
  '/distance/getNearbyWithCategories': P,
};

// Rutas nuevas sin regla: se tratan como AUTH (seguro por defecto).
const REGLA_POR_DEFECTO = AUTH;

// Personal de Solvers: aprueban talleres y validan pagos.
const STAFF = ['Admin', 'Certificador'];
const esStaff = sesion => !!sesion && STAFF.includes(sesion.rol);

// ── Identidad y rol ─────────────────────────────────────────────────────────
const cacheRol = new Map(); // uid → { rol, hasta }
const CACHE_MS = 5 * 60 * 1000;

const rolDe = async (uid, email) => {
  const c = cacheRol.get(uid);
  if (c && c.hasta > Date.now()) return c.rol;
  let rol = null;
  try {
    const u = await db.collection('Usuarios').doc(uid).get();
    if (u.exists) rol = u.data()?.typeUser || 'Cliente';
    if (!rol && email) {
      const a = await db.collection('Admins').where('email', '==', email).limit(1).get();
      if (!a.empty) rol = 'Admin';
    }
  } catch (e) {
    console.warn('[auth] no se pudo leer el rol', uid, e.message);
  }
  cacheRol.set(uid, { rol, hasta: Date.now() + CACHE_MS });
  return rol;
};

const leerSesion = async req => {
  const h = req.headers.authorization || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  const token = m[1].trim();
  // El panel viejo manda "Bearer <uid>": no es un token, no se acepta.
  if (token.split('.').length !== 3) return null;
  try {
    const d = await admin.auth().verifyIdToken(token);
    return { uid: d.uid, email: d.email || null, rol: await rolDe(d.uid, d.email) };
  } catch (e) {
    return null;
  }
};

// ── Reglas especiales ───────────────────────────────────────────────────────
const reglaAsociarPlan = async (req, sesion) => {
  if (esStaff(sesion)) return null;
  const { uid, plan_uid } = req.body || {};
  if (sesion && sesion.uid === uid) return null;
  // Sin sesión solo se permite el plan gratis a un taller recién creado que
  // todavía no tiene suscripción (es el último paso del registro).
  if (String(plan_uid).toLowerCase() !== 'gratis' || !uid) return 'Solo el plan gratis al registrarse';
  try {
    const u = await db.collection('Usuarios').doc(String(uid)).get();
    const d = u.exists ? u.data() : null;
    if (!d || d.typeUser !== 'Taller') return 'Taller no encontrado';
    if (d.subscripcion_actual && d.subscripcion_actual.plan_uid) return 'Ya tiene un plan';
    return null;
  } catch (e) {
    return 'No se pudo verificar el taller';
  }
};

const reglaSendNotification = (req, sesion) => {
  if (!sesion) return 'Requiere sesión';
  if (esStaff(sesion)) return null;
  if (req.body?.token && !req.body?.uid_destino) return 'Usa uid_destino en lugar del token';
  return null;
};

// ── Middleware ──────────────────────────────────────────────────────────────
const motivoBloqueo = async (regla, req, sesion) => {
  if (regla === P) return null;
  if (regla && regla.custom === 'asociarPlan') return reglaAsociarPlan(req, sesion);
  if (regla && regla.custom === 'sendNotification') return reglaSendNotification(req, sesion);
  if (!sesion) return 'Requiere sesión';
  if (esStaff(sesion)) return null;
  if (regla === ADMIN) return 'Solo personal de Solvers';
  if (regla && regla.owner) {
    const b = req.body || {};
    const valores = regla.owner.map(c => b[c]).filter(v => v != null && v !== '');
    if (valores.length && !valores.every(v => String(v) === sesion.uid)) {
      return `No es su cuenta (${regla.owner.join('/')})`;
    }
  }
  return null;
};

const autenticacion = async (req, res, next) => {
  if (MODO === 'off' || req.method === 'OPTIONS') return next();
  const ruta = (req.baseUrl + req.path).replace(/^\/api/, '').replace(/\/$/, '');
  const regla = Object.prototype.hasOwnProperty.call(POLITICA, ruta) ? POLITICA[ruta] : REGLA_POR_DEFECTO;
  const sesion = await leerSesion(req);
  req.sesion = sesion;
  const motivo = await motivoBloqueo(regla, req, sesion);
  if (!motivo) return next();
  if (MODO === 'enforce') {
    return res
      .status(sesion ? 403 : 401)
      .json({ message: sesion ? 'No tienes permiso para esta acción.' : 'Tu sesión venció. Inicia sesión de nuevo.', codigo: sesion ? 'SIN_PERMISO' : 'SIN_SESION' });
  }
  // report: se deja pasar y se registra para revisar antes de activar enforce.
  console.warn(`[auth:report] ${req.method} ${ruta} → ${motivo}${sesion ? ` (uid ${sesion.uid}, ${sesion.rol})` : ' (sin sesión)'} ua="${String(req.headers['user-agent'] || '').slice(0, 60)}"`);
  return next();
};

// Datos de otro usuario que nunca deben salir a terceros.
const CAMPOS_PRIVADOS = ['token', 'password', 'fcmToken', 'certificador_key', 'idToken'];
const limpiarUsuarioPublico = (usuario, sesion, uidDueno) => {
  if (!usuario || typeof usuario !== 'object') return usuario;
  if (sesion && (esStaff(sesion) || sesion.uid === uidDueno)) return usuario;
  const copia = { ...usuario };
  CAMPOS_PRIVADOS.forEach(c => delete copia[c]);
  return copia;
};

module.exports = { autenticacion, limpiarUsuarioPublico, POLITICA, MODO, CAMPOS_PRIVADOS };
