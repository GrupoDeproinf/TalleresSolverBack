// Prueba el script de privatizar documentos con datos falsos (no toca nada real).
//   node scripts/probar-privatizar.js
const path = require('path');
const B = 'demo-bucket';
const PUB = `https://storage.googleapis.com/${B}/`;
const ts = { toDate: () => new Date(0) };
const geo = Object.assign(Object.create({ isEqual() {} }), { latitude: 1, longitude: 2 });
const docs = {
  'Usuarios/t1': { rifIdFiscal: `${PUB}documents/t1/rifIdFiscal.pdf`, image_perfil: `${PUB}profileImages/t1_1.jpg`, geo,
    subscripcion_actual: { fecha: ts, comprobante_pago: { comprobante: `${PUB}paymentcommitment/pm_t1_x.jpg` } } },
  'Usuarios/c1': { licencia_frente_base64: `${PUB}usuarios/c1/documentos_conductor/lic.jpg?t=123`, nombre: 'x' },
  'Subscripciones/s1': { comprobante_pago: { comprobante: `${PUB}paymentcommitment/pm_t1_x.jpg` } },
};
const vehiculos = { 'Usuarios/c1/Vehiculos/v1': { carnet: `${PUB}vehicles/c1/v1/documents/carnet.jpg`, foto: `${PUB}vehicles/c1/v1/v1.jpg` } };
const files = {
  'documents/t1/rifIdFiscal.pdf': { meta: {} }, 'paymentcommitment/pm_t1_x.jpg': { meta: { firebaseStorageDownloadTokens: 'ya-tenia' } },
  'usuarios/c1/documentos_conductor/lic.jpg': { meta: {} }, 'vehicles/c1/v1/documents/carnet.jpg': { meta: {} },
  'vehicles/c1/v1/v1.jpg': { meta: {} }, 'documents/huerfano.pdf': { meta: {} }, 'usuarios/c1/otra.jpg': { meta: {} },
};
const privados = new Set();
const snap = (obj) => ({ size: Object.keys(obj).length, docs: Object.entries(obj).map(([id, d]) => ({ ref: { id }, data: () => d })) });
const db = {
  collection: (n) => ({ get: async () => snap(Object.fromEntries(Object.entries(docs).filter(([k]) => k.split('/')[0] === n && k.split('/').length === 2))) }),
  collectionGroup: () => ({ get: async () => snap(vehiculos) }),
  batch: () => { const ops = []; return { update: (ref, c) => ops.push([ref.id, c]), commit: async () => ops.forEach(([id, c]) => { const t = docs[id] ? docs : vehiculos; Object.assign(t[id], c); }) }; },
};
const bucket = {
  name: B,
  acl: { default: { get: async () => [[{ entity: 'user-x', role: 'OWNER' }]] } },
  file: (n) => ({ name: n, exists: async () => [!!files[n]], getMetadata: async () => [{ metadata: files[n].meta }],
    setMetadata: async ({ metadata }) => Object.assign(files[n].meta, metadata), makePrivate: async () => privados.add(n) }),
  getFiles: async ({ prefix }) => [Object.keys(files).filter((n) => n.startsWith(prefix)).map((n) => bucket.file(n))],
};
require.cache[path.resolve(__dirname, '../src/firebase.js')] = { exports: { db, bucket }, loaded: true, id: 'x' };
process.argv.push('--aplicar');
const salir = process.exit; let fin;
process.exit = () => fin();
const ok = (c, m) => { console.log(`${c ? '✔' : '✘'} ${m}`); if (!c) process.exitCode = 1; };
new Promise((r) => { fin = r; require('./privatizar-documentos'); }).then(() => {
  const t1 = docs['Usuarios/t1'];
  ok(t1.rifIdFiscal.startsWith(`https://firebasestorage.googleapis.com/v0/b/${B}/o/documents%2Ft1%2FrifIdFiscal.pdf?alt=media&token=`), 'RIF con enlace con clave');
  ok(t1.image_perfil === `${PUB}profileImages/t1_1.jpg`, 'foto de perfil sigue pública');
  ok(t1.subscripcion_actual.fecha === ts, 'las fechas no se tocan');
  ok(t1.geo === geo, 'GeoPoint no se toca');
  ok(t1.subscripcion_actual.comprobante_pago.comprobante.endsWith('token=ya-tenia'), 'usa la clave que ya tenía');
  ok(docs['Subscripciones/s1'].comprobante_pago.comprobante === t1.subscripcion_actual.comprobante_pago.comprobante, 'mismo enlace en Subscripciones');
  ok(docs['Usuarios/c1'].licencia_frente_base64.includes('documentos_conductor%2Flic.jpg?alt=media&token='), 'licencia (con ?t=) migrada');
  ok(vehiculos['Usuarios/c1/Vehiculos/v1'].carnet.includes('token='), 'documento de vehículo migrado');
  ok(vehiculos['Usuarios/c1/Vehiculos/v1'].foto === `${PUB}vehicles/c1/v1/v1.jpg`, 'foto del vehículo sigue pública');
  ok(privados.has('documents/huerfano.pdf') && privados.size === 5, `privados: ${[...privados].join(', ')}`);
  ok(!privados.has('vehicles/c1/v1/v1.jpg') && !privados.has('usuarios/c1/otra.jpg'), 'imágenes no sensibles siguen públicas');
  salir(process.exitCode || 0);
});
