// Prueba la tasa BCV sin tocar la base de datos real (se usa una en memoria).
//   node scripts/probar-tasa-bcv.js
const path = require('path');
const docs = new Map();
const consulta = (filtros = [], orden = null, lim = null) => ({
  where: (c, op, v) => consulta([...filtros, [c, op, v]], orden, lim),
  orderBy: (c, dir) => consulta(filtros, [c, dir], lim),
  limit: (n) => consulta(filtros, orden, n),
  get: async () => {
    let filas = [...docs.entries()].map(([id, d]) => ({ id, data: () => d }));
    filtros.forEach(([c, op, v]) => {
      filas = filas.filter((f) => (op === '<=' ? f.data()[c] <= v : f.data()[c] === v));
    });
    if (orden) filas.sort((a, b) => (a.data()[orden[0]] < b.data()[orden[0]] ? -1 : 1) * (orden[1] === 'desc' ? -1 : 1));
    if (lim) filas = filas.slice(0, lim);
    return { empty: !filas.length, size: filas.length, docs: filas };
  },
});
const db = {
  collection: () => ({
    ...consulta(),
    doc: (id) => ({
      get: async () => ({ exists: docs.has(id), data: () => docs.get(id) }),
      set: async (d) => docs.set(id, { ...(docs.get(id) || {}), ...d }),
    }),
  }),
  batch: () => {
    const ops = [];
    return { set: (ref, d) => ops.push([ref, d]), commit: async () => Promise.all(ops.map(([r, d]) => r.set(d))) };
  },
};
require.cache[path.resolve(__dirname, '../src/firebase.js')] = { exports: { db }, loaded: true, id: 'x' };
const T = require('../src/services/tasaBcv');

const ok = (c, m) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) process.exitCode = 1; };

(async () => {
  const html = '<div id="dolar"><span> USD</span><div><strong class="strong-tb"> 876,79760000 </strong></div></div> Fecha Valor: <span class="date-display-single" content="2026-10-13T00:00:00-04:00">Martes</span>';
  const l = T.leerPaginaBcv(html);
  ok(l && l.tasa === 876.7976 && l.fecha === '2026-10-13', 'lee la página del BCV');
  ok(T.leerPaginaBcv('<html></html>') === null, 'página sin tasa → nada');

  const m = T.calcularMontos('35', 875.6505);
  ok(m.subtotal === 35 && m.iva === 5.6 && m.total === 40.6 && m.monto_bs === 35551.41, `Bronce 35 → ${JSON.stringify(m)}`);
  ok(T.calcularMontos('abc', 800) === null, 'monto inválido → nada');
  ok(T.calcularMontos(35, null).monto_bs === null, 'sin tasa → Bs vacío');

  const r = await T.actualizarTasa();
  console.log('  en vivo:', JSON.stringify(r));
  ok(r.errores.length === 0, 'las dos fuentes respondieron sin errores');
  const prox = await T.tasaVigente('2026-12-31');
  ok(prox && prox.tasa > 100, `última tasa publicada ${prox && prox.tasa} (fecha valor ${prox && prox.fecha})`);
  ok(r.historico > 200, `cargó el histórico (${r.historico} días)`);

  const hoy = await T.tasaVigente(T.diaVE());
  ok(hoy && hoy.tasa > 100, `tasa de hoy ${hoy && hoy.tasa} (fecha valor ${hoy && hoy.fecha})`);
  const dom = await T.tasaVigente('2026-10-04');
  ok(dom && dom.fecha <= '2026-10-04', `domingo 04/10 usa la del ${dom && dom.fecha}: ${dom && dom.tasa}`);
  const viejo = await T.tasaVigente('2026-03-15');
  ok(viejo && viejo.tasa > 0, `15/03 → ${viejo && viejo.tasa} (${viejo && viejo.fecha})`);

  docs.set('2026-10-09', { fecha: '2026-10-09', tasa: 900, fuente: 'manual', manual: true });
  await T.actualizarTasa();
  ok(docs.get('2026-10-09').tasa === 900, 'una tasa manual no se pisa');

  const foto = await T.fotoParaPago('35');
  ok(foto.total === 40.6 && foto.tasa_bcv === 900 && foto.monto_bs === 36540, `copia en el pago ${JSON.stringify(foto)}`);

  const res = { status(c) { this.c = c; return this; }, send(b) { this.b = b; return this; } };
  await T.obtenerTasa({ query: { monto: '35' } }, res);
  ok(res.c === 200 && res.b.montos.total === 40.6, `endpoint ${JSON.stringify(res.b)}`);
})();
