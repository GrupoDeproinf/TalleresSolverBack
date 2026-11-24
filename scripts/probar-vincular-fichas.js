// Prueba scripts/vincular-fichas-antiguas.js con datos falsos (no toca nada real).
//   node scripts/probar-vincular-fichas.js
const path = require('path');
const fichas = {
  normal: { email: 'ana@prueba.test', typeUser: 'Cliente' },
  'ficha-beto': { email: 'Beto@Prueba.test', typeUser: 'Cliente' },
  'ficha-cert': { email: 'cert@prueba.test', typeUser: 'Certificador' },
  'ficha-ya': { email: 'ya@prueba.test', typeUser: 'Cliente', uid_auth: 'auth-ya' },
  'ficha-borrada': { email: 'borrada@prueba.test', typeUser: 'Cliente', status: 'Eliminado' },
  'ficha-dup1': { email: 'dup@prueba.test', typeUser: 'Cliente' },
  'ficha-dup2': { email: 'DUP@prueba.test', typeUser: 'Taller' },
  'ficha-choque': { email: 'choque@prueba.test', typeUser: 'Taller' },
  'auth-choque': { email: 'otro@prueba.test', typeUser: 'Cliente' },
};
const auth = { normal: 'ana@prueba.test', 'auth-beto': 'beto@prueba.test', 'auth-cert': 'cert@prueba.test', 'auth-ya': 'ya@prueba.test', 'auth-borrada': 'borrada@prueba.test', 'auth-dup': 'dup@prueba.test', 'auth-choque': 'choque@prueba.test' };
const escritas = {};
const db = {
  collection: () => ({ select: () => ({ get: async () => ({ docs: Object.entries(fichas).map(([id, d]) => ({ id, data: () => d, ref: { id } })) }) }) }),
  batch: () => { const ops = []; return { update: (ref, c) => ops.push([ref.id, c]), commit: async () => ops.forEach(([id, c]) => (escritas[id] = c)) }; },
};
const admin = { auth: () => ({ listUsers: async () => ({ users: Object.entries(auth).map(([uid, email]) => ({ uid, email })) }) }) };
require.cache[path.resolve(__dirname, '../src/firebase.js')] = { exports: { admin, db }, loaded: true, id: 'x' };
process.argv.push('--aplicar');
const log = []; const orig = console.log; console.log = (m) => log.push(String(m));
const salir = process.exit;
process.exit = () => {
  console.log = orig;
  let fallos = 0;
  const ok = (c, m) => { orig(`${c ? '✔' : '✘'} ${m}`); if (!c) fallos += 1; };
  ok(JSON.stringify(escritas) === JSON.stringify({ 'ficha-beto': { uid_auth: 'auth-beto' }, 'ficha-cert': { uid_auth: 'auth-cert' } }), `vincula solo las dos seguras: ${JSON.stringify(escritas)}`);
  ok(!escritas.normal && !escritas['ficha-ya'] && !escritas['ficha-borrada'], 'no toca las normales, las ya vinculadas ni las eliminadas');
  ok(!escritas['ficha-dup1'] && !escritas['ficha-dup2'], 'dos fichas para una cuenta: ninguna');
  ok(!escritas['ficha-choque'], 'si la cuenta ya tiene ficha propia: no se toca');
  ok(!log.join('\n').includes('beto@'), 'no muestra correos completos');
  orig(fallos ? `\n${fallos} prueba(s) fallaron` : '\nTodas las pruebas pasaron');
  salir(fallos ? 1 : 0);
};
require('./vincular-fichas-antiguas');
