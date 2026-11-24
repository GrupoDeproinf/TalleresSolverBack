// Prueba quién puede ver y cambiar solicitudes y propuestas, y el límite de
// peticiones, con una base en memoria (no toca nada real).
//   node scripts/probar-permisos-solicitud.js            (modo enforce)
//   AUTH_MODE=report node scripts/probar-permisos-solicitud.js
const path = require('path');

const MODO = (process.env.AUTH_MODE || 'enforce').toLowerCase();
process.env.AUTH_MODE = MODO;

// ── Base en memoria ─────────────────────────────────────────────────────────
const nuevaBase = () => ({
  Usuarios: {
    ana: { typeUser: 'Cliente' },
    beto: { typeUser: 'Cliente' },
    'taller-1': { typeUser: 'Taller' },
    'taller-2': { typeUser: 'Taller' },
    cert: { typeUser: 'Certificador' },
  },
  Solicitudes: {
    'sol-ana': { uid_usuario: 'ana', uid_taller: '', status: 'En espera por aprobación' },
    'sol-asignada': { uid_usuario: 'ana', uid_taller: 'taller-1', status: 'Aceptada' },
  },
  Propuestas: {
    'p1': { uid_solicitud: 'sol-ana', uid_taller: 'taller-1', status: 'Cotizado', precio_estimado: 40 },
    'p2': { uid_solicitud: 'sol-ana', uid_taller: 'taller-2', status: 'Cotizado', precio_estimado: 35 },
  },
});
let datos = nuevaBase();
const campo = (o, r) => r.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
const consulta = (n, f = []) => ({
  where: (c, op, v) => consulta(n, [...f, [c, op, v]]),
  limit: () => consulta(n, f),
  get: async () => {
    const docs = Object.entries(datos[n] || {})
      .filter(([, d]) => f.every(([c, op, v]) => (op === 'in' ? v.includes(campo(d, c)) : campo(d, c) === v)))
      .map(([id, d]) => ({ id, ref: refDe(n, id), data: () => d }));
    return { empty: docs.length === 0, size: docs.length, docs };
  },
});
const refDe = (n, id) => ({
  id,
  get: async () => ({ id, exists: !!(datos[n] || {})[id], data: () => (datos[n] || {})[id] }),
  update: async (c) => { datos[n][id] = { ...datos[n][id], ...c }; },
  set: async (c) => { (datos[n] = datos[n] || {})[id] = c; },
});
const db = {
  collection: (n) => ({ ...consulta(n), doc: (id) => refDe(n, id), add: async (d) => { const id = `n${Date.now()}`; (datos[n] = datos[n] || {})[id] = d; return refDe(n, id); } }),
  batch: () => { const ops = []; return { update: (ref, c) => ops.push([ref, c]), commit: async () => { for (const [r, c] of ops) await r.update(c); } }; },
};
const admin = {
  auth: () => ({ verifyIdToken: async (t) => ({ uid: t.replace(/^a\.b\./, '') }), getUser: async (uid) => ({ uid }) }),
};
require.cache[path.resolve(__dirname, '../src/firebase.js')] = { exports: { admin, db, bucket: {} }, loaded: true, id: 'f' };
require.cache[require.resolve('firebase/auth')] = { exports: { getAuth: () => ({}), signInWithEmailAndPassword: async () => ({}) }, loaded: true, id: 'fa' };

const { autenticacion } = require('../src/middlewares/auth');
const U = require('../src/services/usuarios.services');
const { limites, SENSIBLE } = require('../src/middlewares/limites');

// ── Utilidades ──────────────────────────────────────────────────────────────
const resFalsa = (resolve) => ({
  statusCode: 200,
  status(c) { this.statusCode = c; return this; },
  json(d) { resolve({ status: this.statusCode, data: d }); },
  send(d) { resolve({ status: this.statusCode, data: d }); },
  set() { return this; },
});
const llamar = (ruta, handler, quien, body) => new Promise((resolve) => {
  const corte = ruta.lastIndexOf('/');
  const req = { method: 'POST', baseUrl: '/api' + ruta.slice(0, corte), path: ruta.slice(corte), headers: quien ? { authorization: `Bearer a.b.${quien}` } : {}, body };
  const res = resFalsa(resolve);
  autenticacion(req, res, () => handler(req, res));
});
const silenciar = (fn) => async (...a) => { const w = console.warn; const e = console.error; console.warn = () => {}; console.error = () => {}; try { return await fn(...a); } finally { console.warn = w; console.error = e; } };
const L = silenciar(llamar);

let fallos = 0;
const ok = (c, m, x) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) { fallos += 1; console.log('   ', JSON.stringify(x)); } };
const NEGADO = MODO === 'enforce' ? 403 : 200;

(async () => {
  console.log(`Modo ${MODO}`);

  console.log('Cambiar el estado de una solicitud');
  let r = await L('/usuarios/updateSolicitudStatus', U.updateSolicitudStatus, 'beto', { uid_solicitud: 'sol-ana', status: 'Cancelado' });
  ok(r.status === NEGADO, `otro conductor: ${NEGADO}`, r);
  ok(MODO !== 'enforce' || datos.Solicitudes['sol-ana'].status !== 'Cancelado', 'la solicitud ajena no cambió', datos.Solicitudes['sol-ana']);
  datos = nuevaBase();
  r = await L('/usuarios/updateSolicitudStatus', U.updateSolicitudStatus, 'taller-1', { uid_solicitud: 'sol-asignada', status: 'Cancelado' });
  ok(r.status === NEGADO, `el taller no cancela la solicitud del conductor: ${NEGADO}`, r);
  r = await L('/usuarios/updateSolicitudStatus', U.updateSolicitudStatus, 'ana', { uid_solicitud: 'sol-ana', status: 'Aceptada' });
  ok(r.status === 400, 'el conductor solo puede cancelar (400 para otro estado)', r);
  datos = nuevaBase();
  r = await L('/usuarios/updateSolicitudStatus', U.updateSolicitudStatus, 'ana', { uid_solicitud: 'sol-ana', status: 'Cancelado' });
  ok(r.status === 200 && datos.Solicitudes['sol-ana'].status === 'Cancelado', 'el conductor dueño cancela su solicitud', r);
  ok(datos.Propuestas.p1.status === 'Rechazada', 'al cancelar se rechazan sus propuestas (como antes)');
  datos = nuevaBase();
  r = await L('/usuarios/updateSolicitudStatus', U.updateSolicitudStatus, 'cert', { uid_solicitud: 'sol-ana', status: 'Revisada' });
  ok(r.status === 200, 'el personal puede cambiar a cualquier estado', r);

  console.log('Aceptar o rechazar una propuesta');
  datos = nuevaBase();
  r = await L('/usuarios/updatePropuesta', U.updatePropuesta, 'beto', { uid_propuesta: 'p1', status: 'aceptada' });
  ok(r.status === NEGADO, `otro conductor: ${NEGADO}`, r);
  datos = nuevaBase();
  r = await L('/usuarios/updatePropuesta', U.updatePropuesta, 'taller-1', { uid_propuesta: 'p1', status: 'aceptada' });
  ok(r.status === NEGADO, `el taller no acepta su propia propuesta: ${NEGADO}`, r);
  datos = nuevaBase();
  r = await L('/usuarios/updatePropuesta', U.updatePropuesta, 'ana', { uid_propuesta: 'p1', status: 'aceptada', uid_usuario: 'beto', status_extra: 'x' });
  ok(r.status === 200 && datos.Propuestas.p1.status === 'Aceptada' && datos.Solicitudes['sol-ana'].status === 'Aceptada', 'el conductor dueño acepta', r);
  ok(datos.Solicitudes['sol-ana'].uid_usuario === 'ana' && !('status_extra' in datos.Solicitudes['sol-ana']), 'los campos extra del body ya no se copian a la solicitud', datos.Solicitudes['sol-ana']);

  console.log('Ver una solicitud y sus propuestas');
  datos = nuevaBase();
  r = await L('/usuarios/getSolicitudByServicioUid', U.getSolicitudByServicioUid, 'beto', { uid_servicio: 'sol-ana' });
  ok(r.status === NEGADO, `solicitud ajena: ${NEGADO}`, r.status);
  r = await L('/usuarios/getSolicitudByServicioUid', U.getSolicitudByServicioUid, 'taller-1', { uid_servicio: 'sol-asignada' });
  ok(r.status === 200 && r.data.id === 'sol-asignada', 'el taller asignado la ve', r.status);
  r = await L('/usuarios/getPropuestasBySolicitud', U.getPropuestasBySolicitud, 'ana', { uid_solicitud: 'sol-ana' });
  ok(r.status === 200 && r.data.length === 2, 'el conductor dueño ve todas las propuestas', r.data);
  r = await L('/usuarios/getPropuestasBySolicitud', U.getPropuestasBySolicitud, 'taller-2', { uid_solicitud: 'sol-ana' });
  ok(r.status === 200 && r.data.length === 1 && r.data[0].id === 'p2', 'un taller solo ve su propia propuesta', r.data);
  r = await L('/usuarios/getPropuestasBySolicitud', U.getPropuestasBySolicitud, 'beto', { uid_solicitud: 'sol-ana' });
  ok(r.status === NEGADO, `propuestas de una solicitud ajena: ${NEGADO}`, r.status);
  r = await L('/usuarios/getPropuestasBySolicitud', U.getPropuestasBySolicitud, 'cert', { uid_solicitud: 'sol-ana' });
  ok(r.status === 200 && r.data.length === 2, 'el personal ve todas', r.data);

  console.log('Fecha de visita');
  r = await L('/usuarios/updateScheduleDate', U.updateScheduleDate, 'beto', { uid: 'ana', scheduled_visit: '01-12-2026' });
  ok(r.status === NEGADO, `no cambia la fecha de otra persona: ${NEGADO}`, r.status);
  r = await L('/usuarios/updateScheduleDate', U.updateScheduleDate, 'ana', { uid: 'ana', scheduled_visit: '01-12-2026' });
  ok(r.status === 200, 'cambia la suya', r);

  if (MODO === 'enforce') {
    console.log('Límite de peticiones');
    const pedir = (ip, ruta) => new Promise((resolve) => {
      const corte = ruta.lastIndexOf('/');
      const req = { method: 'POST', baseUrl: '/api' + ruta.slice(0, corte), path: ruta.slice(corte), headers: ip ? { 'x-forwarded-for': `${ip}, 10.0.0.1` } : {}, ip: '127.0.0.1' };
      limites(req, resFalsa(resolve), () => resolve({ status: 'pasa' }));
    });
    const P = silenciar(pedir);
    let ultimo;
    for (let i = 0; i < SENSIBLE; i += 1) ultimo = await P('200.1.1.1', '/usuarios/authenticateUser');
    ok(ultimo.status === 'pasa', `${SENSIBLE} intentos de entrar por minuto pasan`);
    ultimo = await P('200.1.1.1', '/usuarios/authenticateUser');
    ok(ultimo.status === 429, `el intento ${SENSIBLE + 1} recibe 429`, ultimo);
    ultimo = await P('200.1.1.2', '/usuarios/authenticateUser');
    ok(ultimo.status === 'pasa', 'otra IP no se ve afectada');
    ultimo = await P('200.1.1.1', '/usuarios/getPlanes');
    ok(ultimo.status === 'pasa', 'la misma IP sigue usando el resto de la API');
    for (let i = 0; i < SENSIBLE + 5; i += 1) ultimo = await P('', '/usuarios/authenticateUser');
    ok(ultimo.status === 'pasa', 'sin X-Forwarded-For (IP del propio servidor) no se limita');
  }

  console.log(fallos ? `\n${fallos} prueba(s) fallaron` : '\nTodas las pruebas pasaron');
  process.exit(fallos ? 1 : 0);
})();
