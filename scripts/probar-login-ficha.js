// Prueba que el inicio de sesión devuelve la misma ficha que reconoce la
// seguridad de la API, sin tocar nada real.
//   node scripts/probar-login-ficha.js
const path = require('path');

const datos = {
  Usuarios: {
    // Conductor con dos fichas (caso real): A antigua, B con el id de su cuenta.
    'A-antigua': { email: 'dup@prueba.test', typeUser: 'Cliente' },
    'auth-dup': { email: 'dup@prueba.test', typeUser: 'Cliente' },
    // Cuenta antigua vinculada, y alguien que se puso su correo.
    'ficha-vieja': { email: 'vieja@prueba.test', typeUser: 'Certificador', uid_auth: 'auth-vieja' },
    'copion': { email: 'vieja@prueba.test', typeUser: 'Taller' },
    // Cambió el correo de su ficha: antes el login no la encontraba.
    'auth-cambio': { email: 'otro-correo@prueba.test', typeUser: 'Taller' },
    // Ficha propia eliminada.
    'auth-borrado': { email: 'borrado@prueba.test', typeUser: 'Cliente', status: 'Eliminado' },
    // Guarda un campo uid distinto de su id.
    'auth-campo': { email: 'campo@prueba.test', typeUser: 'Cliente', uid: 'otro-valor' },
    // Ficha sin vincular con el correo de una cuenta que no tiene ficha propia.
    'suelta': { email: 'suelta@prueba.test', typeUser: 'Cliente' },
  },
  Admins: { 'admin-doc': { email: 'jefe@prueba.test' } },
};
const campo = (o, r) => r.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
const consulta = (n, f = []) => ({
  where: (c, op, v) => consulta(n, [...f, [c, v]]),
  limit: () => consulta(n, f),
  get: async () => {
    const docs = Object.entries(datos[n] || {})
      .filter(([, d]) => f.every(([c, v]) => campo(d, c) === v))
      .map(([id, d]) => ({ id, data: () => d }));
    return { empty: docs.length === 0, size: docs.length, docs };
  },
});
const db = { collection: (n) => ({ ...consulta(n), doc: (id) => ({ get: async () => ({ id, exists: !!(datos[n] || {})[id], data: () => (datos[n] || {})[id] }) }) }) };
const cuentas = {
  'dup@prueba.test': 'auth-dup', 'vieja@prueba.test': 'auth-vieja', 'cambio@prueba.test': 'auth-cambio',
  'borrado@prueba.test': 'auth-borrado', 'campo@prueba.test': 'auth-campo', 'jefe@prueba.test': 'auth-jefe',
  'suelta@prueba.test': 'auth-suelta',
};
const admin = {
  auth: () => ({
    verifyIdToken: async (t) => ({ uid: t.replace(/^a\.b\./, ''), email: Object.keys(cuentas).find((e) => cuentas[e] === t.replace(/^a\.b\./, '')) }),
    getUser: async (uid) => ({ uid }),
    createCustomToken: async (uid) => `token-${uid}`,
  }),
};
require.cache[path.resolve(__dirname, '../src/firebase.js')] = { exports: { admin, db, bucket: {} }, loaded: true, id: 'f' };
require.cache[require.resolve('firebase/auth')] = {
  exports: { getAuth: () => ({}), signInWithEmailAndPassword: async (a, email) => ({ user: { uid: cuentas[email] } }) },
  loaded: true, id: 'fa',
};
process.env.AUTH_MODE = 'enforce';
const { authenticateUser } = require('../src/services/usuarios.services');
const { autenticacion } = require('../src/middlewares/auth');

const login = (email) => new Promise((resolve) => {
  const res = { statusCode: 200, status(c) { this.statusCode = c; return this; }, send(d) { resolve({ status: this.statusCode, d }); }, json(d) { resolve({ status: this.statusCode, d }); } };
  authenticateUser({ body: { email, password: 'x' } }, res);
});
const sesionDe = (uidAuth) => new Promise((resolve) => {
  const req = { method: 'POST', baseUrl: '/api/usuarios', path: '/getVehiculosByUsuarioUid', headers: { authorization: `Bearer a.b.${uidAuth}` }, body: {} };
  autenticacion(req, { status() { return this; }, json: () => resolve(req.sesion) }, () => resolve(req.sesion));
});

let fallos = 0;
const ok = (c, m, x) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) { fallos += 1; console.log('   ', JSON.stringify(x)); } };

(async () => {
  const casos = [
    ['dup@prueba.test', 'auth-dup', 'dos fichas: el login da la de su cuenta, no la antigua'],
    ['vieja@prueba.test', 'ficha-vieja', 'cuenta antigua vinculada: su ficha, no la del que copió el correo'],
    ['cambio@prueba.test', 'auth-cambio', 'cambió el correo de su ficha: ahora sí la encuentra'],
    ['borrado@prueba.test', 'auth-borrado', 'ficha propia eliminada: se devuelve (la app muestra el aviso)'],
    ['campo@prueba.test', 'auth-campo', 'el uid devuelto es el id real, aunque la ficha guarde otro campo uid'],
  ];
  for (const [email, esperado, nombre] of casos) {
    const r = await login(email);
    const s = await sesionDe(cuentas[email]);
    ok(r.status === 200 && r.d.userData.uid === esperado && s.uid === esperado, `${nombre} (y la API reconoce la misma)`, { login: r.d && r.d.userData && r.d.userData.uid, api: s && s.uid });
  }
  let r = await login('jefe@prueba.test');
  ok(r.status === 200 && r.d.message.includes('Admin') && r.d.userData.uid === 'admin-doc', 'admin sin ficha en Usuarios: entra como Admin', r);
  r = await login('suelta@prueba.test');
  ok(r.status === 404, 'ficha sin vincular (solo coincide el correo): no se entrega', r);

  console.log(fallos ? `\n${fallos} prueba(s) fallaron` : '\nTodas las pruebas pasaron');
  process.exit(fallos ? 1 : 0);
})();
