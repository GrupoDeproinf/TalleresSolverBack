// Archivos sensibles en Storage: comprobantes de pago, RIF y permiso de
// operación, documentos de conductores y de vehículos.
//
// Antes se subían como públicos (`public: true`) y se guardaba la dirección
// https://storage.googleapis.com/<bucket>/<ruta>: cualquiera con el enlace
// podía verlos, sin importar las reglas de Storage.
//
// Ahora se suben privados y se guarda un enlace de descarga de Firebase con
// una clave aleatoria (?alt=media&token=<uuid>). El panel y la app lo abren
// igual que antes, pero ya no se puede adivinar ni armar a partir de la ruta.
// Las imágenes que ven los conductores (perfil, logos, fotos del taller y de
// servicios) siguen públicas a propósito.

const crypto = require('crypto');
const { bucket } = require('../firebase');

// Carpetas con datos sensibles (ruta dentro del bucket).
const RUTAS_SENSIBLES = [
  /^paymentcommitment\//,
  /^documents\//,
  /^usuarios\/[^/]+\/documentos_conductor\//,
  /^vehicles\/[^/]+\/[^/]+\/documents\//,
];

const esRutaSensible = (ruta) => RUTAS_SENSIBLES.some((r) => r.test(String(ruta || '')));

const urlConClave = (ruta, clave) =>
  `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(ruta)}?alt=media&token=${clave}`;

/** Sube un archivo privado y devuelve su enlace de descarga con clave. */
const subirArchivoPrivado = async (ruta, buffer, contentType) => {
  const clave = crypto.randomUUID();
  const archivo = bucket.file(ruta);
  await archivo.save(buffer, {
    metadata: { contentType, metadata: { firebaseStorageDownloadTokens: clave } },
    validation: 'md5',
  });
  // Si antes había un archivo público con el mismo nombre, que no quede así.
  await archivo.makePrivate().catch(() => {});
  return urlConClave(ruta, clave);
};

/**
 * Ruta dentro del bucket a partir de un enlace guardado (público antiguo o
 * con clave). Devuelve '' si el enlace no es de este bucket. Función pura.
 */
const rutaDesdeUrl = (url, nombreBucket = bucket.name) => {
  const u = String(url || '').trim();
  const publica = `https://storage.googleapis.com/${nombreBucket}/`;
  if (u.startsWith(publica)) {
    return decodeURIComponent(u.slice(publica.length).split('?')[0]);
  }
  const conClave = `https://firebasestorage.googleapis.com/v0/b/${nombreBucket}/o/`;
  if (u.startsWith(conClave)) {
    return decodeURIComponent(u.slice(conClave.length).split('?')[0]);
  }
  return '';
};

module.exports = { RUTAS_SENSIBLES, esRutaSensible, urlConClave, subirArchivoPrivado, rutaDesdeUrl };
