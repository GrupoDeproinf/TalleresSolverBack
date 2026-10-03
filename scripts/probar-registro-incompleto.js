// Prueba local del aviso de registro incompleto, con Firestore simulado y un
// webhook en este mismo equipo. Uso: node scripts/probar-registro-incompleto.js
const http = require('http');
const path = require('path');

// ── Firestore en memoria (solo lo que usa el servicio) ──────────────────────
const store = new Map();
const snapDoc = (id) => ({ id, exists: store.has(id), data: () => store.get(id), ref: refDoc(id) });
const refDoc = (id) => ({
  id,
  get: async () => snapDoc(id),
  set: async (v, o) => store.set(id, o && o.merge ? { ...(store.get(id) || {}), ...v } : v),
  delete: async () => store.delete(id),
});
const consulta = (filtros = [], lim = Infinity) => ({
  where: (c, op, v) => consulta([...filtros, [c, op, v]], lim),
  limit: (n) => consulta(filtros, n),
  get: async () => {
    const docs = [...store.keys()]
      .filter((id) => filtros.every(([c, op, v]) => {
        const x = store.get(id)[c];
        return op === '==' ? x === v : op === '<=' ? x <= v : false;
      }))
      .slice(0, lim)
      .map(snapDoc);
    return { docs, size: docs.length, forEach: (f) => docs.forEach(f) };
  },
});
const db = { collection: () => ({ doc: refDoc, ...consulta() }) };
require.cache[path.resolve(__dirname, '../src/firebase.js')] = { id: 'firebase', filename: 'firebase', loaded: true, exports: { db } };

const R = require('../src/services/registroIncompleto');
const res = () => ({ code: 0, body: null, status(c) { this.code = c; return this; }, send(b) { this.body = b; return this; } });
const ok = (cond, texto) => { console.log(`${cond ? '✔' : '✘ FALLO'}  ${texto}`); if (!cond) process.exitCode = 1; };

(async () => {
  const recibidos = [];
  const server = http.createServer((req, rs) => {
    let cuerpo = '';
    req.on('data', (c) => (cuerpo += c));
    req.on('end', () => { recibidos.push({ auth: req.headers.authorization, body: JSON.parse(cuerpo) }); rs.writeHead(200); rs.end('ok'); });
  });
  await new Promise((r) => server.listen(0, r));
  const url = `http://127.0.0.1:${server.address().port}/hook`;

  let r = res();
  await R.guardarProgreso({ body: { borradorId: 'corto', paso: 2, whatsapp: '+584145089640' } }, r);
  ok(r.code === 400, 'rechaza un identificador inválido');

  r = res();
  await R.guardarProgreso({ body: { borradorId: 'borrador-sin-telefono-1', paso: 1, responsable: 'Ana' } }, r);
  ok(r.body.guardado === false && store.size === 0, 'sin número de WhatsApp no guarda nada');

  r = res();
  await R.guardarProgreso({ body: { borradorId: 'borrador-taller-0001', paso: 2, responsable: 'Luis Pérez', nombre: 'Tallerss', email: 'Taller2025@Gmail.com', phone: '+58 414 508 9640', whatsapp: '', faltantes: ['RIF', 'Dirección', 'Foto del frente'] } }, r);
  const d = store.get('borrador-taller-0001');
  ok(r.body.guardado && d.whatsapp === '+584145089640' && d.email === 'taller2025@gmail.com' && d.avisado === false, 'guarda el avance con WhatsApp y correo normalizados');

  let s = await R.revisarRegistrosIncompletos();
  ok(s.activo === false && recibidos.length === 0, 'sin enlace configurado no envía nada');

  process.env.REGISTRO_INCOMPLETO_WEBHOOK_URL = url;
  process.env.REGISTRO_INCOMPLETO_TOKEN = 'secreto-de-prueba';
  s = await R.revisarRegistrosIncompletos();
  ok(s.avisados === 0 && recibidos.length === 0, 'no avisa si aún no pasó el tiempo de espera');

  store.get('borrador-taller-0001').actualizadoEn = new Date(Date.now() - 61 * 60000);
  s = await R.revisarRegistrosIncompletos();
  const a = recibidos[0];
  ok(s.avisados === 1 && recibidos.length === 1, 'avisa cuando pasan 60 minutos sin actividad');
  ok(a && a.body.whatsapp === '+584145089640' && a.body.faltantes.length === 3 && a.body.pasoActual === 2, 'el aviso lleva el WhatsApp y el detalle de lo que falta');
  ok(a && a.auth === 'Bearer secreto-de-prueba', 'el aviso lleva el token de autorización');

  s = await R.revisarRegistrosIncompletos();
  ok(s.avisados === 0 && recibidos.length === 1, 'no repite el aviso del mismo borrador');

  await R.guardarProgreso({ body: { borradorId: 'borrador-taller-0002', paso: 3, phone: '+584241112233', email: 'otro@correo.com' } }, res());
  await R.marcarCompletado({ email: 'otro@correo.com', phone: '' });
  ok(!store.has('borrador-taller-0002'), 'al completar el registro se retira el borrador');

  await R.guardarProgreso({ body: { borradorId: 'borrador-taller-0003', paso: 1, phone: '+584249998877' } }, res());
  store.get('borrador-taller-0003').actualizadoEn = new Date(Date.now() - 31 * 86400000);
  s = await R.revisarRegistrosIncompletos();
  ok(s.borrados === 1 && !store.has('borrador-taller-0003'), 'borra los borradores de más de 30 días');

  process.env.REGISTRO_INCOMPLETO_WEBHOOK_URL = 'http://127.0.0.1:9/caido';
  await R.guardarProgreso({ body: { borradorId: 'borrador-taller-0004', paso: 1, phone: '+584240001122' } }, res());
  store.get('borrador-taller-0004').actualizadoEn = new Date(Date.now() - 90 * 60000);
  s = await R.revisarRegistrosIncompletos();
  ok(s.fallidos === 1 && store.get('borrador-taller-0004').avisado === false && store.get('borrador-taller-0004').intentos === 1, 'si el webhook falla, queda pendiente y cuenta el intento');

  console.log('\nEjemplo del aviso que recibe el webhook:\n' + JSON.stringify(a.body, null, 2));
  server.close();
})();
