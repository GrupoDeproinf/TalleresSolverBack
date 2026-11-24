// Prueba qué ficha devuelve el inicio de sesión cuando varias comparten correo.
//   node scripts/probar-elegir-ficha.js
const { elegirFicha } = require('../src/services/elegirFicha');
const doc = (id, d = {}) => ({ id, data: () => d });
let fallos = 0;
const ok = (c, m) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) fallos += 1; };
const id = (d) => (d ? d.id : null);

// Los 4 casos reales: ficha antigua (primera por id) y ficha con el id de la cuenta.
ok(id(elegirFicha([doc('G81zf0'), doc('LvC7Y0')], 'LvC7Y0')) === 'LvC7Y0', 'duplicada: gana la ficha con el id de su cuenta, no la primera');
ok(id(elegirFicha([doc('ficha-vieja', { uid_auth: 'auth-x' }), doc('otra')], 'auth-x')) === 'ficha-vieja', 'cuenta antigua vinculada: gana la de uid_auth');
ok(id(elegirFicha([doc('copion', { typeUser: 'Taller' }), doc('real', { uid_auth: 'auth-v' })], 'auth-v')) === 'real', 'quien se puso el correo de otro no le gana la ficha');
ok(id(elegirFicha([doc('unica')], 'auth-z')) === 'unica', 'una sola ficha: la de siempre');
ok(id(elegirFicha([doc('auth-y', { status: 'Eliminado' }), doc('nueva')], 'auth-y')) === 'nueva', 'la propia eliminada no gana a una activa');
ok(id(elegirFicha([doc('borrada', { status: 'Eliminado' })], 'auth-w')) === 'borrada', 'solo eliminada: se devuelve (la app muestra su aviso)');
ok(elegirFicha([], 'x') === null, 'sin fichas: nada');

console.log(fallos ? `\n${fallos} prueba(s) fallaron` : '\nTodas las pruebas pasaron');
process.exit(fallos ? 1 : 0);
