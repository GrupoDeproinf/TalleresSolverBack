// SEC-04: las rutas "owner" exigen el campo del dueño, y los servicios de un
// taller solo los edita o borra ese taller. Base en memoria (no toca nada real).
//   node scripts/probar-dueno-obligatorio.js            (modo enforce)
//   AUTH_MODE=report node scripts/probar-dueno-obligatorio.js
const path = require('path');

const MODO = (process.env.AUTH_MODE || 'enforce').toLowerCase();
process.env.AUTH_MODE = MODO;

const nuevaBase = () => ({
  Usuarios: {
    ana: { typeUser: 'Cliente' },
    beto: { typeUser: 'Cliente' },
    'taller-1': { typeUser: 'Taller', subscripcion_actual: { cantidad_servicios: '3' } },
    'taller-2': { typeUser: 'Taller', subscripcion_actual: { cantidad_servicios: '3' } },
    cert: { typeUser: 'Certificador' },
  },
  Servicios: {
    s1: { uid_taller: 'taller-1', nombre_servicio: 'Cambio de aceite', estatus: false },
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
  delete: async () => { delete datos[n][id]; },
  collection: (sub) => db.collection(`${n}/${id}/${sub}`),
});
const db = {
  collection: (n) => ({ ...consulta(n), doc: (id) => refDe(n, id), add: async (d) => { const id = `n${Date.now()}`; (datos[n] = datos[n] || {})[id] = d; return refDe(n, id); } }),
  batch: () => { const ops = []; return { update: (ref, c) => ops.push([ref, c]), commit: async () => { for (const [r, c] of ops) await r.update(c); } }; },
};
const admin = {
  auth: () => ({ verifyIdToken: async (t) => ({ uid: t.replace(/^a\.b\./, '') }), getUser: async (uid) => ({ uid }) }),
};
const bucket = { name: 'prueba', getFiles: async () => [[]], file: () => ({ save: async () => {}, delete: async () => {} }) };
require.cache[path.resolve(__dirname, '../src/firebase.js')] = { exports: { admin, db, bucket }, loaded: true, id: 'f' };
require.cache[require.resolve('firebase/auth')] = { exports: { getAuth: () => ({}), signInWithEmailAndPassword: async () => ({}) }, loaded: true, id: 'fa' };

const { autenticacion } = require('../src/middlewares/auth');
const U = require('../src/services/usuarios.services');

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
  autenticacion(req, resFalsa(resolve), () => handler(req, resFalsa(resolve)));
});
const silenciar = (fn) => async (...a) => { const w = console.warn; const e = console.error; const l = console.log; console.warn = () => {}; console.error = () => {}; console.log = () => {}; try { return await fn(...a); } finally { console.warn = w; console.error = e; console.log = l; } };
const L = silenciar(llamar);
// Handler que solo dice "llegó": para probar la regla de la ruta sin el servicio.
const llega = (req, res) => res.json({ llego: true });

let fallos = 0;
const ok = (c, m, x) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) { fallos += 1; console.log('   ', JSON.stringify(x)); } };
const ENF = MODO === 'enforce';
const NEGADO = ENF ? 403 : 200;

(async () => {
  console.log(`Modo ${MODO}`);

  console.log('Rutas owner sin el campo del dueño');
  let r = await L('/usuarios/getVehiculosByUsuarioUid', llega, 'ana', {});
  ok(r.status === NEGADO, `sin uid: ${NEGADO}`, r);
  r = await L('/usuarios/getVehiculosByUsuarioUid', llega, 'ana', { uid: '' });
  ok(r.status === NEGADO, `uid vacío: ${NEGADO}`, r);
  r = await L('/usuarios/getVehiculosByUsuarioUid', llega, 'ana', { uid: 'ana' });
  ok(r.status === 200 && r.data.llego, 'con su propio uid pasa', r);
  r = await L('/usuarios/getVehiculosByUsuarioUid', llega, 'ana', { uid: 'beto' });
  ok(r.status === NEGADO, `con uid ajeno: ${NEGADO}`, r);
  r = await L('/usuarios/getVehiculosByUsuarioUid', llega, 'cert', {});
  ok(r.status === 200, 'el personal pasa aunque falte el campo', r);
  r = await L('/usuarios/getVehiculosByUsuarioUid', llega, null, { uid: 'ana' });
  ok(r.status === (ENF ? 401 : 200), `sin sesión: ${ENF ? 401 : 200}`, r);

  console.log('Vehículos y documentos del conductor');
  r = await L('/usuarios/saveOrUpdateVehiculo', llega, 'beto', { uiduser: 'ana' });
  ok(r.status === NEGADO, `guardar vehículo en otra cuenta: ${NEGADO}`, r);
  r = await L('/usuarios/saveOrUpdateVehiculo', llega, 'ana', { uiduser: 'ana' });
  ok(r.status === 200, 'guardar vehículo propio pasa', r);
  r = await L('/usuarios/updateUsuarioDocumentacionConductor', llega, 'beto', { uid: 'ana' });
  ok(r.status === NEGADO, `documentos de otro conductor: ${NEGADO}`, r);
  r = await L('/usuarios/updateUsuarioDocumentacionConductor', llega, 'ana', { uid: 'ana' });
  ok(r.status === 200, 'documentos propios pasan', r);

  console.log('Editar un servicio');
  datos = nuevaBase();
  r = await L('/usuarios/saveOrUpdateService', U.saveOrUpdateService, 'taller-2', { id: 's1', uid_taller: 'taller-2', nombre_servicio: 'Robado', estatus: false });
  ok(r.status === NEGADO, `otro taller edita el servicio: ${NEGADO}`, r);
  ok(!ENF || datos.Servicios.s1.nombre_servicio === 'Cambio de aceite', 'el servicio ajeno no cambió', datos.Servicios.s1);
  datos = nuevaBase();
  r = await L('/usuarios/saveOrUpdateService', U.saveOrUpdateService, 'taller-1', { id: 's1', uid_taller: 'taller-2', estatus: false });
  ok(r.status === NEGADO, `pasar el servicio a otro taller: ${NEGADO}`, r);
  datos = nuevaBase();
  r = await L('/usuarios/saveOrUpdateService', U.saveOrUpdateService, 'taller-1', { id: 's1', uid_taller: 'taller-1', nombre_servicio: 'Cambio de aceite y filtro', estatus: false });
  ok(r.status === 200 && datos.Servicios.s1.nombre_servicio === 'Cambio de aceite y filtro', 'su taller lo edita', r);
  datos = nuevaBase();
  r = await L('/usuarios/saveOrUpdateService', U.saveOrUpdateService, 'cert', { id: 's1', uid_taller: 'taller-1', nombre_servicio: 'Revisado', estatus: false });
  ok(r.status === 200 && datos.Servicios.s1.nombre_servicio === 'Revisado', 'el personal lo edita', r);

  console.log('Borrar un servicio');
  datos = nuevaBase();
  r = await L('/usuarios/deleteService', U.deleteService, 'taller-2', { id: 's1', uid_taller: 'taller-2' });
  ok(r.status === NEGADO, `otro taller lo borra: ${NEGADO}`, r);
  ok(!ENF || !!datos.Servicios.s1, 'el servicio ajeno sigue ahí', datos.Servicios);
  datos = nuevaBase();
  r = await L('/usuarios/deleteService', U.deleteService, 'taller-2', { id: 's1' });
  ok(r.status === NEGADO, `sin uid_taller: ${NEGADO}`, r);
  ok(!ENF || !!datos.Servicios.s1, 'el servicio sigue ahí', datos.Servicios);
  datos = nuevaBase();
  r = await L('/usuarios/deleteService', U.deleteService, 'taller-1', { id: 's1', uid_taller: 'taller-1' });
  ok(r.status === 200 && !datos.Servicios.s1, 'su taller lo borra', r);
  datos = nuevaBase();
  datos.Servicios.s1.estatus = true;
  r = await L('/usuarios/deleteService', U.deleteService, 'cert', { id: 's1', uid_taller: 'taller-2' });
  ok(r.status === 200 && // (la base en memoria guarda la ruta con puntos tal cual)
    datos.Usuarios['taller-1']['subscripcion_actual.cantidad_servicios'] === '4' && !('subscripcion_actual.cantidad_servicios' in datos.Usuarios['taller-2']),
    'el cupo vuelve al dueño real, no al que dice el body', datos.Usuarios);

  console.log(fallos ? `\n${fallos} prueba(s) fallaron` : '\nTodas las pruebas pasaron');
  process.exit(fallos ? 1 : 0);
})();
