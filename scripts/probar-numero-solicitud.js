// Prueba la numeración de solicitudes sin tocar la base real.
//   node scripts/probar-numero-solicitud.js
const path = require('path');
const datos = { Contadores: {}, Solicitudes: {}, Propuestas: {} };
const ts = (ms) => ({ toMillis: () => ms });
datos.Solicitudes.b = { fecha_solicitud: ts(2000) };
datos.Solicitudes.a = { fecha_solicitud: ts(1000) };
datos.Solicitudes.c = { fecha_solicitud: ts(3000) };
datos.Propuestas.p1 = { uid_solicitud: 'b' };
const ref = (col, id) => ({
  id,
  get: async () => ({ exists: !!datos[col][id], data: () => datos[col][id] }),
  update: async (u) => Object.assign(datos[col][id], u),
  set: async (u) => (datos[col][id] = { ...(datos[col][id] || {}), ...u }),
});
const db = {
  collection: (col) => ({
    doc: (id) => ref(col, id),
    get: async () => ({ docs: Object.keys(datos[col]).map((id) => ({ id, ref: ref(col, id), data: () => datos[col][id] })) }),
  }),
  runTransaction: async (fn) => fn({ get: (r) => r.get(), set: (r, u) => r.set(u) }),
  batch: () => { const ops = []; return { update: (r, u) => ops.push(() => r.update(u)), commit: async () => { for (const o of ops) await o(); } }; },
};
require.cache[path.resolve(__dirname, '../src/firebase.js')] = { exports: { db }, loaded: true, id: 'x' };
const N = require('../src/services/numeroSolicitud');
const ok = (c, m) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) process.exitCode = 1; };
(async () => {
  ok((await N.numerarSolicitudesAnteriores()) === 3, 'numera las 3 anteriores');
  ok(datos.Solicitudes.a.codigo_solicitud === 'S-000001' && datos.Solicitudes.c.codigo_solicitud === 'S-000003', 'en orden de creación');
  const nueva = await N.numeroParaSolicitudNueva();
  ok(nueva.codigo_solicitud === 'S-000004', `la siguiente nueva es ${nueva.codigo_solicitud}`);
  ok((await N.numerarSolicitudesAnteriores()) === 0, 'volver a correrlo no renumera nada');
  ok((await N.copiarNumeroAPropuestas()) === 1 && datos.Propuestas.p1.codigo_solicitud === 'S-000002', 'el presupuesto toma el número de su solicitud');
})();
