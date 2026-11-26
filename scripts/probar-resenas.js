// Reseñas a nombre propio, sin correos en la lectura pública, y suscripciones
// solo del propio taller. Base en memoria (no toca nada real).
//   node scripts/probar-resenas.js            (modo enforce)
//   AUTH_MODE=report node scripts/probar-resenas.js
const path = require('path');

const MODO = (process.env.AUTH_MODE || 'enforce').toLowerCase();
process.env.AUTH_MODE = MODO;

const nuevaBase = () => ({
  Usuarios: {
    ana: { typeUser: 'Cliente', nombre: 'Ana Pérez', email: 'ana@ejemplo.com', image_perfil: 'https://x/ana.jpg' },
    beto: { typeUser: 'Cliente', nombre: 'Beto Gómez', email: 'beto@ejemplo.com' },
    'taller-1': { typeUser: 'Taller', nombre: 'Taller Uno' },
    'taller-2': { typeUser: 'Taller', nombre: 'Taller Dos' },
    cert: { typeUser: 'Certificador', nombre: 'Personal' },
    'ficha-vieja': { typeUser: 'Cliente', nombre: 'Carla Antigua', uid_auth: 'auth-vieja' },
  },
  Servicios: { s1: { uid_taller: 'taller-1', taller: 'Taller Uno', nombre_servicio: 'Frenos' } },
  'Servicios/s1/calificaciones': {
    c1: { puntuacion: 5, usuario: { uid: 'ana', nombre: 'Ana Pérez', email: 'ana@ejemplo.com', token: 'fcm-secreto', password: 'x' } },
  },
  'Usuarios/taller-1/calificaciones': { c2: { puntuacion: 4, usuario: { id: 'beto', nombre: 'Beto', email: 'beto@ejemplo.com' } } },
  Subscripciones: { sub1: { taller_uid: 'taller-1', referencia_pago: '1234' }, sub2: { taller_uid: 'taller-2', referencia_pago: '9999' } },
});
let datos = nuevaBase();
const campo = (o, r) => r.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
const consulta = (n, f = []) => ({
  where: (c, op, v) => consulta(n, [...f, [c, op, v]]),
  limit: () => consulta(n, f),
  select: () => consulta(n, f),
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
let seq = 0;
const db = {
  collection: (n) => ({ ...consulta(n), doc: (id) => refDe(n, id), add: async (d) => { const id = `n${seq += 1}`; (datos[n] = datos[n] || {})[id] = d; return refDe(n, id); } }),
};
const admin = { auth: () => ({ verifyIdToken: async (t) => ({ uid: t.replace(/^a\.b\./, '') }), getUser: async (uid) => ({ uid }) }) };
require.cache[path.resolve(__dirname, '../src/firebase.js')] = { exports: { admin, db, bucket: {} }, loaded: true, id: 'f' };
require.cache[require.resolve('firebase/auth')] = { exports: { getAuth: () => ({}), signInWithEmailAndPassword: async () => ({}) }, loaded: true, id: 'fa' };

const { autenticacion } = require('../src/middlewares/auth');
const H = require('../src/services/home.services');

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

let fallos = 0;
const ok = (c, m, x) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) { fallos += 1; console.log('   ', JSON.stringify(x)); } };
const ENF = MODO === 'enforce';
const NEGADO = ENF ? 403 : 201;
const nuevas = (col) => Object.entries(datos[col] || {}).filter(([id]) => id.startsWith('n')).map(([, d]) => d);
const SC = 'Servicios/s1/calificaciones';
const TC = 'Usuarios/taller-1/calificaciones';
const resena = (extra) => ({ uid_service: 's1', comentario: 'Muy bien', puntuacion: 5, usuario: { uid: 'ana', nombre: 'Ana', email: 'ana@ejemplo.com' }, ...extra });

(async () => {
  console.log(`Modo ${MODO}`);

  console.log('Lectura pública de reseñas');
  let r = await L('/home/getCommentsByService', H.getCommentsByService, null, { uid_service: 's1' });
  const u1 = r.data && r.data[0] && r.data[0].usuario;
  ok(r.status === 200 && u1 && u1.nombre === 'Ana Pérez' && u1.uid === 'ana', 'se ve el nombre y el uid del autor', r);
  ok(u1 && !('email' in u1) && !('token' in u1) && !('password' in u1), 'no sale el correo ni el token del autor', u1);
  r = await L('/home/getCommentsByTaller', H.getCommentsByTaller, null, { uid_taller: 'taller-1' });
  const u2 = r.data && r.data[0] && r.data[0].usuario;
  ok(r.status === 200 && u2 && u2.uid === 'beto' && !('email' in u2), 'reseñas del taller: sin correo; las viejas con `id` siguen identificadas', r);

  console.log('Reseñar un servicio');
  datos = nuevaBase();
  r = await L('/home/addCommentToService', H.addCommentToService, 'ana', resena());
  let g = nuevas(SC)[0];
  ok(r.status === 201 && g && g.usuario.uid === 'ana' && g.usuario.nombre === 'Ana Pérez' && g.usuario.image_perfil === 'https://x/ana.jpg', 'el autor sale de su ficha', g);
  ok(r.data && r.data.comment && !('email' in r.data.comment.usuario), 'la respuesta tampoco trae el correo', r.data);
  datos = nuevaBase();
  r = await L('/home/addCommentToService', H.addCommentToService, 'beto', resena());
  ok(r.status === NEGADO, `reseñar a nombre de otra persona: ${NEGADO}`, r);
  ok(!ENF || nuevas(SC).length === 0, 'no se guardó', nuevas(SC));
  datos = nuevaBase();
  r = await L('/home/addCommentToService', H.addCommentToService, 'ana', resena({ uid_taller: 'taller-2', nombre_taller: 'Otro' }));
  g = nuevas(SC)[0];
  ok(r.status === 201 && g.uid_taller === 'taller-1' && g.nombre_taller === 'Taller Uno', 'el taller es el del servicio, no el del body', g);
  for (const p of [0, 6, 1000, 'abc', null]) {
    datos = nuevaBase();
    r = await L('/home/addCommentToService', H.addCommentToService, 'ana', resena({ puntuacion: p }));
    ok(r.status === 400 && nuevas(SC).length === 0, `puntuación ${JSON.stringify(p)}: 400`, r);
  }
  datos = nuevaBase();
  r = await L('/home/addCommentToService', H.addCommentToService, 'taller-1', resena({ usuario: { uid: 'taller-1' } }));
  ok(r.status === NEGADO, `el taller reseña su propio servicio: ${NEGADO}`, r);
  datos = nuevaBase();
  r = await L('/home/addCommentToService', H.addCommentToService, 'auth-vieja', resena({ usuario: { uid: 'ficha-vieja', nombre: 'Carla' } }));
  g = nuevas(SC)[0];
  ok(r.status === 201 && g && g.usuario.uid === 'ficha-vieja' && g.usuario.nombre === 'Carla Antigua', 'cuenta antigua (ficha ≠ uid de Auth) reseña a su nombre', r);
  datos = nuevaBase();
  r = await L('/home/addCommentToService', H.addCommentToService, null, resena());
  ok(r.status === (ENF ? 401 : 201), `sin sesión: ${ENF ? 401 : '201 (como antes, solo se registra)'}`, r);

  console.log('Reseñar un taller');
  datos = nuevaBase();
  r = await L('/home/addCommentToTaller', H.addCommentToTaller, 'ana', { uid_taller: 'taller-1', puntuacion: 4, comentario: 'Bien', usuario: { uid: 'ana' } });
  g = nuevas(TC)[0];
  ok(r.status === 201 && g && g.usuario.nombre === 'Ana Pérez' && g.nombre_taller === 'Taller Uno', 'el conductor reseña el taller a su nombre', g);
  datos = nuevaBase();
  r = await L('/home/addCommentToTaller', H.addCommentToTaller, 'beto', { uid_taller: 'taller-1', puntuacion: 1, usuario: { uid: 'ana' } });
  ok(r.status === NEGADO, `a nombre de otra persona: ${NEGADO}`, r);
  datos = nuevaBase();
  r = await L('/home/addCommentToTaller', H.addCommentToTaller, 'taller-1', { uid_taller: 'taller-1', puntuacion: 5, usuario: { uid: 'taller-1' } });
  ok(r.status === NEGADO, `el taller se reseña a sí mismo: ${NEGADO}`, r);
  datos = nuevaBase();
  r = await L('/home/addCommentToTaller', H.addCommentToTaller, 'beto', { uid_taller: 'ana', puntuacion: 1, usuario: { uid: 'beto' } });
  ok(r.status === 404, 'no se reseña a un conductor como si fuera taller (404)', r);
  datos = nuevaBase();
  r = await L('/home/addCommentToTaller', H.addCommentToTaller, 'ana', { uid_taller: 'taller-1', puntuacion: 9, usuario: { uid: 'ana' } });
  ok(r.status === 400, 'puntuación 9: 400', r);
  datos = nuevaBase();
  r = await L('/home/addCommentToTaller', H.addCommentToTaller, 'cert', { uid_taller: 'taller-1', puntuacion: 3, usuario: { uid: 'beto' } });
  g = nuevas(TC)[0];
  ok(r.status === 201 && g.usuario.uid === 'beto', 'el personal puede cargar una reseña a nombre de otro', g);

  console.log('Suscripciones del taller');
  datos = nuevaBase();
  r = await L('/home/getSubscriptionById', H.getSubscriptionsById, 'taller-1', { uid: 'taller-1' });
  ok(r.status === 200 && r.data.length === 1 && r.data[0].id === 'sub1', 'el taller ve las suyas', r);
  r = await L('/home/getSubscriptionById', H.getSubscriptionsById, 'taller-1', { uid: 'taller-2' });
  ok(r.status === (ENF ? 403 : 200), `las de otro taller: ${ENF ? 403 : 200}`, r);
  r = await L('/home/getSubscriptionById', H.getSubscriptionsById, 'cert', { uid: 'taller-2' });
  ok(r.status === 200 && r.data[0].id === 'sub2', 'el personal ve las de cualquiera', r);

  console.log(fallos ? `\n${fallos} prueba(s) fallaron` : '\nTodas las pruebas pasaron');
  process.exit(fallos ? 1 : 0);
})();
