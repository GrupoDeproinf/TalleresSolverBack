// Prueba la búsqueda de direcciones contra OpenStreetMap.
//   node scripts/probar-direcciones.js
const D = require('../src/services/direcciones');
const ok = (c, m) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) process.exitCode = 1; };
const pedir = async (q, estado) => {
  const res = { status() { return this; }, send(b) { this.b = b; return this; } };
  await D.buscarDireccion({ query: { q, estado }, headers: {}, ip: '1.1.1.1' }, res);
  return res.b.resultados;
};
(async () => {
  ok(D.paraBuscar('Av. Bolívar Norte, local 3, frente a la plaza', 'Carabobo') === 'Avenida Bolívar Norte, Carabobo', `limpia: ${D.paraBuscar('Av. Bolívar Norte, local 3, frente a la plaza', 'Carabobo')}`);
  ok(D.paraBuscar('Calle 72 #3-45', 'Zulia') === 'Calle 72, Zulia', `limpia número: ${D.paraBuscar('Calle 72 #3-45', 'Zulia')}`);
  ok((await pedir('Av', 'Lara')).length === 0, 'texto muy corto → nada');
  for (const [q, e, latMin, latMax] of [
    ['Avenida bolivar norte, valencia', 'Carabobo', 10.1, 10.3],
    ['Av. Francisco de Miranda, Chacao', 'Miranda', 10.4, 10.6],
    ['Avenida Lara, Barquisimeto, local 4 frente a la plaza', 'Lara', 10.0, 10.1],
  ]) {
    const r = await pedir(q, e);
    console.log('  ', q, '→', JSON.stringify(r.slice(0, 2)));
    ok(r.length > 0 && r[0].lat > latMin && r[0].lat < latMax, `ubica "${q}"`);
  }
  const t = Date.now();
  await pedir('Avenida bolivar norte, valencia', 'Carabobo');
  ok(Date.now() - t < 50, 'la segunda vez sale de la caché');
})();
