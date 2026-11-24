// Corre todas las pruebas de scripts/probar-*.js (base en memoria, sin tocar
// nada real) y comprueba la sintaxis de src/. Falla si alguna falla.
//   node scripts/probar-todo.js
// Se excluyen las que consultan servicios en vivo (BCV): se corren a mano.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const EN_VIVO = new Set(['probar-tasa-bcv.js']);
const dir = __dirname;
let fallos = 0;

// 1. Sintaxis de todo src/ (con la misma configuración de Babel del arranque).
const babel = require('@babel/core');
const archivos = [];
(function recorrer(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) recorrer(p);
    else if (f.endsWith('.js')) archivos.push(p);
  }
})(path.join(dir, '..', 'src'));
for (const f of archivos) {
  try {
    babel.transformSync(fs.readFileSync(f, 'utf8'), { filename: f });
  } catch (e) {
    fallos += 1;
    console.log(`✘ sintaxis ${path.relative(process.cwd(), f)}: ${e.message.split('\n')[0]}`);
  }
}
console.log(`Sintaxis: ${archivos.length} archivos revisados`);

// 2. Pruebas.
const pruebas = fs.readdirSync(dir).filter((f) => /^probar-.*\.js$/.test(f) && f !== 'probar-todo.js' && !EN_VIVO.has(f));
const modos = { 'probar-permisos-solicitud.js': ['enforce', 'report'] };
for (const f of pruebas) {
  for (const modo of modos[f] || [null]) {
    const env = { ...process.env };
    if (modo) env.AUTH_MODE = modo;
    const r = spawnSync(process.execPath, [path.join(dir, f)], { env, encoding: 'utf8', timeout: 120000 });
    const nombre = modo ? `${f} (${modo})` : f;
    if (r.status === 0) {
      console.log(`✔ ${nombre}`);
    } else {
      fallos += 1;
      console.log(`✘ ${nombre}\n${(r.stdout || '').slice(-2000)}${(r.stderr || '').slice(-2000)}`);
    }
  }
}
console.log(fallos ? `\n${fallos} fallo(s)` : '\nTodo en verde');
process.exit(fallos ? 1 : 0);
