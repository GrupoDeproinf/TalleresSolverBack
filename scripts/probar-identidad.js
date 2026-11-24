// Prueba la identidad de la sesión (ficha de Usuarios frente a uid de Auth)
// y el historial de contactos, con una base en memoria (no toca nada real).
//   node scripts/probar-identidad.js
const path = require('path');

// ── Base en memoria ─────────────────────────────────────────────────────────
const datos = {
  Usuarios: {
    // Cuenta normal: el id de la ficha es el uid de Auth.
    'auth-ana': { email: 'ana@prueba.test', typeUser: 'Cliente' },
    // Cuenta antigua: la ficha tiene otro id.
    'ficha-beto': { email: 'beto@prueba.test', typeUser: 'Cliente', uid_auth: 'auth-beto' },
    'ficha-cert': { email: 'cert@prueba.test', typeUser: 'Certificador', uid_auth: 'auth-cert' },
    // Cuenta antigua todavía sin vincular: se queda sin ficha.
    'ficha-sinvinculo': { email: 'sinv@prueba.test', typeUser: 'Certificador' },
    // Ficha eliminada cuyo id es el uid de Auth: no da rol.
    'auth-borrado': { email: 'borrado@prueba.test', typeUser: 'Certificador', status: 'Eliminado' },
    // Dos fichas activas con el mismo correo: no se elige ninguna.
    // Dos fichas activas vinculadas a la misma cuenta: no se elige ninguna.
    'ficha-dup1': { email: 'dup@prueba.test', typeUser: 'Cliente', uid_auth: 'auth-dup' },
    'ficha-dup2': { email: 'dup@prueba.test', typeUser: 'Certificador', uid_auth: 'auth-dup' },
    // Ficha eliminada con el mismo correo que una activa.
    'ficha-eva-vieja': { email: 'eva@prueba.test', typeUser: 'Certificador', status: 'Eliminado', uid_auth: 'auth-eva' },
    'ficha-eva': { email: 'eva@prueba.test', typeUser: 'Cliente', uid_auth: 'auth-eva' },
    // Un taller se pone el correo de la cuenta sin vincular: no gana nada.
    'ficha-copion': { email: 'sinv@prueba.test', typeUser: 'Taller' },
    // Certificador antiguo ya vinculado con uid_auth, y un taller que se puso
    // su mismo correo para intentar dejarlo sin identidad.
    'ficha-cert2': { email: 'cert2@prueba.test', typeUser: 'Certificador', uid_auth: 'auth-cert2' },
    'ficha-intruso': { email: 'cert2@prueba.test', typeUser: 'Taller' },
  },
  Admins: { 'admin-doc': { email: 'jefe@prueba.test' } },
  servicesContact: {
    c1: { usuario: { id: 'auth-ana' }, uid_servicio: '' },
    c2: { usuario: { id: 'ficha-beto' }, uid_servicio: '' },
    c3: { usuario: { id: 'ficha-beto' }, uid_servicio: '' },
    c4: { usuario: { id: 'otra-persona' }, uid_servicio: '' },
  },
  Servicios: {},
};
let lecturas = 0;
const campo = (obj, ruta) => ruta.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const consulta = (n, filtros = [], lim = Infinity) => ({
  where: (f, op, v) => consulta(n, [...filtros, [f, op, v]], lim),
  limit: (k) => consulta(n, filtros, k),
  get: async () => {
    const docs = Object.entries(datos[n] || {})
      .filter(([, d]) => filtros.every(([f, op, v]) => (op === '==' ? campo(d, f) === v : op === 'in' ? v.includes(campo(d, f)) : false)))
      .slice(0, lim)
      .map(([id, d]) => ({ id, data: () => d }));
    lecturas += docs.length || 1;
    return { empty: docs.length === 0, docs };
  },
});
const db = {
  collection: (n) => ({
    ...consulta(n),
    doc: (id) => ({
      get: async () => {
        lecturas += 1;
        return { exists: !!(datos[n] || {})[id], data: () => (datos[n] || {})[id] };
      },
    }),
  }),
};

// Tokens falsos: "token-<uidAuth>". El correo viene de la cuenta de Auth.
const cuentasAuth = {
  'auth-ana': 'ana@prueba.test',
  'auth-beto': 'beto@prueba.test',
  'auth-cert': 'cert@prueba.test',
  'auth-dup': 'dup@prueba.test',
  'auth-eva': 'eva@prueba.test',
  'auth-jefe': 'jefe@prueba.test',
  'auth-cert2': 'cert2@prueba.test',
  'auth-sinv': 'sinv@prueba.test',
  'auth-borrado': 'borrado@prueba.test',
  'auth-sin-correo-en-token': 'beto@prueba.test',
};
const admin = {
  auth: () => ({
    verifyIdToken: async (t) => {
      const uid = t.replace(/^a\.b\./, '');
      if (!cuentasAuth[uid]) throw new Error('token inválido');
      return { uid, email: uid === 'auth-sin-correo-en-token' ? undefined : cuentasAuth[uid] };
    },
    getUser: async (uid) => ({ uid, email: cuentasAuth[uid] }),
  }),
};
require.cache[path.resolve(__dirname, '../src/firebase.js')] = { exports: { admin, db, bucket: {} }, loaded: true, id: 'x' };

process.env.AUTH_MODE = 'enforce';
const { autenticacion } = require('../src/middlewares/auth');
const Home = require('../src/services/home.services');

// ── Utilidades ──────────────────────────────────────────────────────────────
const llamar = (ruta, { uidAuth, body = {}, method = 'POST' } = {}) =>
  new Promise((resolve) => {
    const req = {
      method,
      baseUrl: '/api' + ruta.slice(0, ruta.lastIndexOf('/')),
      path: ruta.slice(ruta.lastIndexOf('/')),
      headers: uidAuth ? { authorization: `Bearer a.b.${uidAuth}` } : {},
      body,
    };
    const res = {
      statusCode: 200,
      status(c) { this.statusCode = c; return this; },
      json(d) { resolve({ status: this.statusCode, data: d, req }); },
      send(d) { resolve({ status: this.statusCode, data: d, req }); },
    };
    autenticacion(req, res, () => resolve({ status: 'pasa', req }));
  });

const historial = async (uidAuth) => {
  const r = await llamar('/home/getContactService', { uidAuth, method: 'GET' });
  if (r.status !== 'pasa') return r;
  return new Promise((resolve) => {
    const res = {
      statusCode: 200,
      status(c) { this.statusCode = c; return this; },
      json(d) { resolve({ status: this.statusCode, data: d }); },
      send(d) { resolve({ status: this.statusCode, data: d }); },
    };
    Home.getServicesContact(r.req, res);
  });
};

let fallos = 0;
const ok = (c, m, extra) => {
  console.log(`${c ? '✔' : '✘'} ${m}`);
  if (!c) { fallos += 1; if (extra !== undefined) console.log('   ', JSON.stringify(extra)); }
};
const ids = (r) => (Array.isArray(r.data) ? r.data.map((x) => x.id).sort().join(',') : String(r.status));

(async () => {
  console.log('Identidad de la sesión');
  let r = await llamar('/usuarios/getVehiculosByUsuarioUid', { uidAuth: 'auth-ana', body: { uid: 'auth-ana' } });
  ok(r.status === 'pasa' && r.req.sesion.uid === 'auth-ana' && r.req.sesion.rol === 'Cliente', 'cuenta normal: su ficha es su uid de Auth');

  r = await llamar('/usuarios/getVehiculosByUsuarioUid', { uidAuth: 'auth-beto', body: { uid: 'ficha-beto' } });
  ok(r.status === 'pasa' && r.req.sesion.uid === 'ficha-beto' && r.req.sesion.uidAuth === 'auth-beto', 'cuenta antigua: entra a lo suyo con el id de su ficha', r.req && r.req.sesion);

  r = await llamar('/usuarios/getVehiculosByUsuarioUid', { uidAuth: 'auth-beto', body: { uid: 'auth-beto' } });
  ok(r.status === 'pasa', 'cuenta antigua: también se acepta su uid de Auth');

  r = await llamar('/usuarios/getVehiculosByUsuarioUid', { uidAuth: 'auth-beto', body: { uid: 'auth-ana' } });
  ok(r.status === 403, 'cuenta antigua: no entra a lo de otra persona', r.status);

  r = await llamar('/usuarios/getVehiculosByUsuarioUid', { uidAuth: 'auth-ana', body: { uid: 'ficha-beto' } });
  ok(r.status === 403, 'cuenta normal: no entra a lo de otra persona', r.status);

  r = await llamar('/usuarios/getTalleres', { uidAuth: 'auth-sinv', body: {} });
  ok(r.status === 403 && r.req.sesion.uid === 'auth-sinv' && !r.req.sesion.rol, 'cuenta antigua sin vincular: sin ficha ni rol (el correo no cuenta)', r.req && r.req.sesion);

  r = await llamar('/usuarios/getVehiculosByUsuarioUid', { uidAuth: 'auth-sinv', body: { uid: 'ficha-copion' } });
  ok(r.status === 403, 'nadie se cuela por tener el mismo correo en su ficha', r.status);

  r = await llamar('/usuarios/getTalleres', { uidAuth: 'auth-borrado', body: {} });
  ok(r.status === 403 && !r.req.sesion.rol, 'ficha eliminada: no conserva el rol de personal', r.req && r.req.sesion);

  r = await llamar('/usuarios/getTalleres', { uidAuth: 'auth-cert', body: {} });
  ok(r.status === 'pasa' && r.req.sesion.rol === 'Certificador', 'certificador con ficha antigua conserva su rol (rutas de personal)', r.req && r.req.sesion);

  r = await llamar('/usuarios/getTalleres', { uidAuth: 'auth-beto', body: {} });
  ok(r.status === 403, 'un conductor no entra a rutas de personal', r.status);

  r = await llamar('/usuarios/getTalleres', { uidAuth: 'auth-dup', body: {} });
  ok(r.status === 403 && r.req.sesion.uid === 'auth-dup', 'correo con dos fichas activas: no se elige ninguna (ni el rol de certificador)', r.req && r.req.sesion);

  r = await llamar('/usuarios/getTalleres', { uidAuth: 'auth-eva', body: {} });
  ok(r.status === 403 && r.req.sesion.uid === 'ficha-eva', 'la ficha eliminada no cuenta: se usa la activa', r.req && r.req.sesion);

  r = await llamar('/usuarios/getTalleres', { uidAuth: 'auth-cert2', body: {} });
  ok(r.status === 'pasa' && r.req.sesion.uid === 'ficha-cert2' && r.req.sesion.rol === 'Certificador', 'ficha vinculada con uid_auth: el correo repetido de otro no la afecta', r.req && r.req.sesion);

  r = await llamar('/usuarios/GetUsers', { uidAuth: 'auth-jefe', body: {} });
  ok(r.status === 'pasa' && r.req.sesion.rol === 'Admin', 'admin (en Admins por correo) sigue entrando');

  r = await llamar('/usuarios/getVehiculosByUsuarioUid', { body: { uid: 'auth-ana' } });
  ok(r.status === 401, 'sin sesión: 401', r.status);

  console.log('Historial de contactos');
  r = await historial('auth-ana');
  ok(ids(r) === 'c1', 'cuenta normal ve solo lo suyo', ids(r));
  r = await historial('auth-beto');
  ok(ids(r) === 'c2,c3', 'cuenta antigua ve solo lo suyo', ids(r));
  r = await historial('auth-cert');
  ok(ids(r) === 'c1,c2,c3,c4', 'el personal ve todos', ids(r));
  r = await historial(undefined);
  ok(r.status === 401, 'sin sesión en enforce: 401', r.status);

  // En modo report, sin sesión la llamada pasa el middleware: el servicio no
  // debe devolver los contactos de nadie.
  r = await new Promise((resolve) => {
    const res = { status() { return this; }, json: (d) => resolve(d), send: (d) => resolve(d) };
    Home.getServicesContact({ sesion: null }, res);
  });
  ok(Array.isArray(r) && r.length === 0, 'sin sesión (modo report): lista vacía, nunca los de otros', r);

  console.log('Caché');
  const antes = lecturas;
  await llamar('/usuarios/getVehiculosByUsuarioUid', { uidAuth: 'auth-beto', body: { uid: 'ficha-beto' } });
  ok(lecturas === antes, 'la identidad se guarda 5 minutos (sin lecturas extra)', lecturas - antes);

  console.log(fallos ? `\n${fallos} prueba(s) fallaron` : '\nTodas las pruebas pasaron');
  process.exit(fallos ? 1 : 0);
})();
