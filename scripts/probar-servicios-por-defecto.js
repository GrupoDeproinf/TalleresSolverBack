// Prueba local de los servicios por defecto, con Firestore simulado.
// Uso: node scripts/probar-servicios-por-defecto.js
const path = require('path');
const store = { Servicios: new Map(), Planes: new Map([['IPbc9VN1kmvIwrZHzNpd', { cantidad_servicios: 5 }]]) };
let n = 0;
const col = (nombre) => {
  const m = store[nombre];
  const q = (f = [], lim = Infinity) => ({
    where: (c, op, v) => q([...f, [c, v]], lim),
    limit: (x) => q(f, x),
    get: async () => {
      const docs = [...m.entries()].filter(([, d]) => f.every(([c, v]) => d[c] === v)).slice(0, lim);
      return { empty: !docs.length, size: docs.length, docs };
    },
  });
  return {
    doc: (id = `auto${++n}`) => ({ id, get: async () => ({ exists: m.has(id), data: () => m.get(id) }), _set: (v) => m.set(id, v) }),
    ...q(),
  };
};
const db = { collection: col, batch: () => { const ops = []; return { set: (ref, v) => ops.push(() => ref._set(v)), commit: async () => ops.forEach((o) => o()) }; } };
require.cache[path.resolve(__dirname, '../src/firebase.js')] = { id: 'f', filename: 'f', loaded: true, exports: { db } };

const S = require('../src/services/serviciosPorDefecto');
const ok = (c, t) => { console.log(`${c ? '✔' : '✘ FALLO'}  ${t}`); if (!c) process.exitCode = 1; };
const cats = (k) => Array.from({ length: k }, (_, i) => ({ uid: `cat${i + 1}`, nombre: ['CAMBIO DE ACEITE', 'Latoneria y Pintura', 'MECANICA', 'Electroauto', 'GAS', 'Radiadores', 'Parabrisas'][i] }));

(async () => {
  let r = await S.crearServiciosPorDefecto({ uidTaller: 't1', nombreTaller: 'Tallerss', categorias: cats(3) });
  const de = (t) => [...store.Servicios.values()].filter((d) => d.uid_taller === t);
  ok(r.creados === 3 && de('t1').length === 3, 'crea un servicio por cada categoría elegida');
  const p = de('t1')[0];
  ok(p.estatus === false && p.precio === '' && p.porDefecto === true, 'quedan sin publicar, sin precio y marcados como "por defecto"');
  ok(p.nombre_servicio === 'Cambio de aceite' && p.categoria === 'CAMBIO DE ACEITE' && p.uid_categoria === 'cat1', 'nombre legible y categoría original');
  ok(p.uid_servicio && p.taller === 'Tallerss', 'lleva su identificador y el nombre del taller');

  r = await S.crearServiciosPorDefecto({ uidTaller: 't1', nombreTaller: 'Tallerss', categorias: cats(3) });
  ok(r.creados === 0 && r.motivo === 'ya_tiene_servicios' && de('t1').length === 3, 'no duplica si el taller ya tiene servicios');

  r = await S.crearServiciosPorDefecto({ uidTaller: 't2', nombreTaller: 'Otro', categorias: cats(7) });
  ok(r.creados === 5 && de('t2').length === 5, 'con 7 categorías y cupo 5, crea solo 5');
  ok(de('t2')[0].uid_categoria === 'cat1' && de('t2')[4].uid_categoria === 'cat5', 'respeta el orden en que se eligieron');

  store.Planes.set('IPbc9VN1kmvIwrZHzNpd', { cantidad_servicios: '50' });
  r = await S.crearServiciosPorDefecto({ uidTaller: 't3', nombreTaller: 'X', categorias: cats(7) });
  ok(r.creados === 7, 'si el plan permite 50, crea las 7');

  r = await S.crearServiciosPorDefecto({ uidTaller: 't4', nombreTaller: 'X', categorias: [{ uid: 'a', nombre: 'GAS' }, { uid: 'a', nombre: 'GAS' }, { uid: '', nombre: 'x' }] });
  ok(r.creados === 1, 'ignora categorías repetidas o incompletas');

  r = await S.crearServiciosPorDefecto({ uidTaller: 't5', nombreTaller: 'X', categorias: [] });
  ok(r.creados === 0, 'sin categorías no crea nada');
})();
