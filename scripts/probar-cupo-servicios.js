// Prueba el cálculo del cupo de servicios sin tocar la base real.
//   node scripts/probar-cupo-servicios.js
const path = require('path');
const datos = {
  Planes: { g: { nombre: 'GRATIS', cantidad_servicios: 5 }, b: { nombre: 'Plan Bronce', cantidad_servicios: 5 } },
  Usuarios: { t1: { subscripcion_actual: { nombre: 'GRATIS', status: 'Aprobado', cantidad_servicios: '5' } } },
  Servicios: {},
};
for (let i = 1; i <= 6; i++) datos.Servicios[`s${i}`] = { uid_taller: 't1', estatus: true };
datos.Servicios.s7 = { uid_taller: 't1', estatus: false };
const col = (n) => {
  const q = (f = []) => ({
    where: (c, op, v) => q([...f, [c, v]]),
    get: async () => {
      const docs = Object.entries(datos[n]).filter(([, d]) => f.every(([c, v]) => d[c] === v)).map(([id, d]) => ({ id, data: () => d }));
      return { docs, empty: !docs.length, size: docs.length };
    },
  });
  return {
    ...q(),
    doc: (id) => ({
      get: async () => ({ exists: !!datos[n][id], data: () => datos[n][id] }),
      update: async (u) => {
        Object.entries(u).forEach(([k, v]) => {
          const [a, b] = k.split('.');
          if (b) datos[n][id][a][b] = v; else datos[n][id][a] = v;
        });
      },
    }),
  };
};
require.cache[path.resolve(__dirname, '../src/firebase.js')] = { exports: { db: { collection: col } }, loaded: true, id: 'x' };
const C = require('../src/services/cupoServicios');
const ok = (c, m) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) process.exitCode = 1; };
(async () => {
  let e = await C.estadoCupo('t1');
  ok(e.total === 5 && e.publicados === 6 && e.restante === 0, `GRATIS con 6 publicados → total 5, quedan 0 (${JSON.stringify({ t: e.total, p: e.publicados, r: e.restante })})`);
  await C.sincronizarCupo('t1');
  ok(datos.Usuarios.t1.subscripcion_actual.cantidad_servicios === '0', 'el contador descuadrado (5) se corrige a 0');
  datos.Servicios.s6.estatus = false; datos.Servicios.s5.estatus = false;
  e = await C.sincronizarCupo('t1');
  ok(e.restante === 1 && datos.Usuarios.t1.subscripcion_actual.cantidad_servicios === '1', 'al ocultar 2 queda 1 cupo');
  e = await C.estadoCupo('t1', { excluirId: 's1' });
  ok(e.publicados === 3, 'al editar uno ya publicado no se cuenta a sí mismo');
  datos.Usuarios.t1.subscripcion_actual.status = 'Vencido';
  ok((await C.estadoCupo('t1')).total === 0, 'plan vencido → cupo 0');
  datos.Usuarios.t1.subscripcion_actual = { nombre: 'Plan Desconocido' };
  ok((await C.estadoCupo('t1')).total === null, 'plan que no existe → no se bloquea');
  console.log('  mensaje:', C.mensajeSinCupo(5));
})();
