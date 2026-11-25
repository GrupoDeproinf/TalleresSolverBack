// Prueba que la API no muestra negocios dados de baja: ni en la lista del
// certificador (getTalleres con todos) ni en el historial de contactos del
// conductor (getContactService). Base en memoria, sin tocar nada real.
//   node scripts/probar-ocultar-depurados.js
const path = require('path');

const datos = {
  Usuarios: {
    activo: { uid: 'activo', typeUser: 'Taller', status: 'Aprobado' },
    espera: { uid: 'espera', typeUser: 'Taller', status: 'En espera por aprobación' },
    baja: { uid: 'baja', typeUser: 'Taller', status: 'Eliminado' },
    baja2: { uid: 'baja2', typeUser: 'Taller', status: ' eliminado ' },
    raro: { uid: 'raro', typeUser: ' taller ', status: 'Aprobado' },
    conductor: { uid: 'conductor', typeUser: 'Cliente' },
  },
  Servicios: {
    s1: { uid_taller: 'activo' }, s2: { uid_taller: 'baja' }, s3: { uid_taller: 'borrado' },
  },
  servicesContact: {
    c1: { usuario: { id: 'conductor' }, uid_servicio: 's1', uid_taller: 'activo' },
    c2: { usuario: { id: 'conductor' }, uid_servicio: 's2', uid_taller: 'baja' },
    c3: { usuario: { id: 'conductor' }, uid_servicio: 's3', uid_taller: 'borrado' },
    c4: { usuario: { id: 'conductor' }, uid_servicio: 's1' }, // sin campo de taller: lo toma del servicio
    c5: { usuario: { id: 'conductor' }, uid_servicio: 's2' },
    c6: { usuario: { id: 'otro' }, uid_servicio: 's1', uid_taller: 'activo' },
    c7: { usuario: { id: 'conductor' }, uid_servicio: 's1', uid_taller: 'conductor' }, // apunta a alguien que no es taller
    c8: { usuario: { id: 'conductor' }, uid_servicio: 's1', uid_taller: 'raro' }, // typeUser con espacios
  },
};
const campo = (o, r) => r.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
const cumple = (d, [c, op, v]) => (op === 'in' ? v.includes(campo(d, c)) : campo(d, c) === v);
const consulta = (n, f = []) => ({
  where: (c, op, v) => consulta(n, [...f, [c, op, v]]),
  get: async () => {
    const docs = Object.entries(datos[n] || {})
      .filter(([, d]) => f.every((x) => cumple(d, x)))
      .map(([id, d]) => ({ id, data: () => d }));
    return { empty: docs.length === 0, size: docs.length, docs };
  },
});
const leer = (n, id) => ({ id, exists: !!(datos[n] || {})[id], data: () => (datos[n] || {})[id] });
const db = {
  collection: (n) => ({ ...consulta(n), doc: (id) => ({ _n: n, id, get: async () => leer(n, id) }) }),
  getAll: async (...refs) => refs.map((r) => leer(r._n, r.id)),
};
require.cache[path.resolve(__dirname, '../src/firebase.js')] = { exports: { admin: {}, db, bucket: {} }, loaded: true, id: 'f' };

const { getTalleres } = require('../src/services/usuarios.services');
const { getServicesContact } = require('../src/services/home.services');

const llamar = (fn, req) => new Promise((resolve) => {
  const res = { statusCode: 200, status(c) { this.statusCode = c; return this; }, send(d) { resolve({ status: this.statusCode, d }); }, json(d) { resolve({ status: this.statusCode, d }); } };
  fn(req, res);
});

let fallos = 0;
const ok = (cond, msg) => { console.log(`${cond ? '✔' : '✘'} ${msg}`); if (!cond) fallos += 1; };

(async () => {
  const todos = await llamar(getTalleres, { body: { todos: true } });
  const ids = todos.d.map((u) => u.uid).sort();
  ok(JSON.stringify(ids) === '["activo","espera"]', `certificador con todos: solo activos (${ids})`);

  const porAtender = await llamar(getTalleres, { body: {} });
  ok(porAtender.d.map((u) => u.uid).join() === 'espera', 'sin todos: sigue igual (solo por atender)');

  const conductor = await llamar(getServicesContact, { body: {}, sesion: { uid: 'conductor', rol: 'Cliente' } });
  const cs = conductor.d.map((c) => c.id).sort();
  ok(JSON.stringify(cs) === '["c1","c4","c8"]', `historial del conductor sin negocios borrados ni dados de baja (${cs})`);

  const personal = await llamar(getServicesContact, { body: {}, sesion: { uid: 'x', rol: 'Admin' } });
  ok(JSON.stringify(personal.d.map((c) => c.id).sort()) === '["c1","c4","c6","c8"]', 'el personal tampoco ve contactos de negocios dados de baja');

  if (fallos) { console.log(`${fallos} fallo(s)`); process.exit(1); }
  console.log('Todo bien');
})();
