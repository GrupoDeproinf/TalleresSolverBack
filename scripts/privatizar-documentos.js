// Vuelve privados los archivos sensibles que ya existen en Storage
// (comprobantes, RIF y permisos, documentos de conductores y de vehículos).
//
// 1. Busca en Usuarios, Subscripciones y Vehiculos los enlaces públicos
//    antiguos (https://storage.googleapis.com/<bucket>/<ruta sensible>).
// 2. A cada archivo le asigna una clave de descarga (o usa la que ya tiene) y
//    cambia el enlace guardado por el enlace con clave, que sigue abriendo
//    igual en el panel y en la app.
// 3. Solo después de actualizar los documentos, quita el acceso público de
//    todos los archivos de las carpetas sensibles.
//
// Sin --aplicar solo muestra lo que haría (no cambia nada).
//   node scripts/privatizar-documentos.js
//   node scripts/privatizar-documentos.js --aplicar
const crypto = require('crypto');
const { db, bucket } = require('../src/firebase');
const { esRutaSensible, urlConClave, rutaDesdeUrl } = require('../src/services/archivosPrivados');

const APLICAR = process.argv.includes('--aplicar');
const PUBLICA = `https://storage.googleapis.com/${bucket.name}/`;

// Solo se recorren mapas simples: fechas, GeoPoint y referencias se dejan tal cual.
const esObjetoSimple = (v) =>
  !!v && typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype && typeof v.toDate !== 'function';

/** Recorre un valor y devuelve las rutas sensibles con enlace público. */
const rutasEn = (v, salida) => {
  if (typeof v === 'string') {
    if (v.startsWith(PUBLICA)) {
      const ruta = rutaDesdeUrl(v);
      if (esRutaSensible(ruta)) salida.add(ruta);
    }
  } else if (Array.isArray(v)) {
    v.forEach((x) => rutasEn(x, salida));
  } else if (esObjetoSimple(v)) {
    Object.values(v).forEach((x) => rutasEn(x, salida));
  }
  return salida;
};

/** Copia del valor con los enlaces públicos cambiados por los nuevos. */
const reemplazar = (v, nuevos) => {
  if (typeof v === 'string') {
    if (!v.startsWith(PUBLICA)) return v;
    const ruta = rutaDesdeUrl(v);
    return nuevos.has(ruta) ? nuevos.get(ruta) : v;
  }
  if (Array.isArray(v)) return v.map((x) => reemplazar(x, nuevos));
  if (esObjetoSimple(v)) {
    const c = {};
    Object.keys(v).forEach((k) => {
      c[k] = reemplazar(v[k], nuevos);
    });
    return c;
  }
  return v;
};

(async () => {
  // 0. Que los archivos nuevos no salgan públicos por defecto.
  try {
    const [acl] = await bucket.acl.default.get();
    const publico = (acl || []).some((e) => e.entity === 'allUsers');
    console.log(`Permisos por defecto del bucket: ${publico ? 'PÚBLICOS (revisar antes de seguir)' : 'privados'}`);
    if (publico) process.exitCode = 2;
  } catch (e) {
    console.log(`Permisos por defecto del bucket: no se pudieron leer (${e.message})`);
  }

  // 1. Documentos de Firestore con enlaces públicos sensibles.
  const fuentes = [
    ['Usuarios', await db.collection('Usuarios').get()],
    ['Subscripciones', await db.collection('Subscripciones').get()],
    ['Vehiculos', await db.collectionGroup('Vehiculos').get()],
  ];
  const afectados = []; // { ref, campos: {campo: valor} }
  const rutas = new Set();
  fuentes.forEach(([nombre, snap]) => {
    let n = 0;
    snap.docs.forEach((d) => {
      const data = d.data() || {};
      const campos = {};
      Object.keys(data).forEach((k) => {
        const r = rutasEn(data[k], new Set());
        if (r.size) {
          campos[k] = data[k];
          r.forEach((x) => rutas.add(x));
        }
      });
      if (Object.keys(campos).length) {
        afectados.push({ ref: d.ref, campos });
        n += 1;
      }
    });
    console.log(`${nombre}: ${snap.size} documentos, ${n} con enlaces públicos sensibles`);
  });
  console.log(`Archivos sensibles enlazados: ${rutas.size}`);

  // 2. Clave de descarga por archivo.
  const nuevos = new Map();
  const claves = [];
  let faltan = 0;
  for (const ruta of rutas) {
    const archivo = bucket.file(ruta);
    const [existe] = await archivo.exists();
    if (!existe) {
      faltan += 1;
      continue;
    }
    const [meta] = await archivo.getMetadata();
    const previa = String((meta.metadata && meta.metadata.firebaseStorageDownloadTokens) || '').split(',')[0];
    const clave = previa || crypto.randomUUID();
    if (!previa) claves.push({ archivo, clave });
    nuevos.set(ruta, urlConClave(ruta, clave));
  }
  console.log(`Con clave nueva: ${claves.length}. Ya tenían clave: ${nuevos.size - claves.length}. No existen en Storage: ${faltan}`);

  // 3. Todos los archivos de las carpetas sensibles (también los no enlazados).
  const sensibles = [];
  for (const prefijo of ['paymentcommitment/', 'documents/', 'usuarios/', 'vehicles/']) {
    const [archivos] = await bucket.getFiles({ prefix: prefijo });
    archivos.filter((f) => esRutaSensible(f.name)).forEach((f) => sensibles.push(f));
  }
  console.log(`Archivos en carpetas sensibles: ${sensibles.length}`);

  if (!APLICAR) {
    console.log('Nada guardado (falta --aplicar).');
    process.exit(process.exitCode || 0);
  }
  if (process.exitCode === 2) {
    console.log('Detenido: los permisos por defecto del bucket son públicos.');
    process.exit(2);
  }

  for (const { archivo, clave } of claves) {
    await archivo.setMetadata({ metadata: { firebaseStorageDownloadTokens: clave } });
  }
  console.log('Claves asignadas.');

  for (let i = 0; i < afectados.length; i += 400) {
    const batch = db.batch();
    afectados.slice(i, i + 400).forEach(({ ref, campos }) => {
      const cambios = {};
      Object.keys(campos).forEach((k) => {
        cambios[k] = reemplazar(campos[k], nuevos);
      });
      batch.update(ref, cambios);
    });
    await batch.commit();
  }
  console.log(`Enlaces actualizados en ${afectados.length} documentos.`);

  let privados = 0;
  for (const f of sensibles) {
    try {
      await f.makePrivate();
      privados += 1;
    } catch (e) {
      console.log(`  no se pudo cerrar ${f.name.split('/')[0]}/…: ${e.message}`);
    }
  }
  console.log(`Archivos ahora privados: ${privados} de ${sensibles.length}. Listo.`);
  process.exit(0);
})().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
