// Domicilio fiscal (dirección y estado) del comprobante de RIF.
//
// Observación 1.4.6: en el registro, al subir la foto o el PDF del RIF, la app
// llena sola la dirección y el estado si el taller aún no los escribió.
//
//   · PDF original del SENIAT → el texto ya viene en el archivo.
//   · Foto o captura → reconocimiento de texto (OCR) con tesseract.js, en el
//     propio servidor (sin servicios externos ni costo por uso). Se toma el
//     bloque que empieza en "DOMICILIO FISCAL" y termina en "ZONA POSTAL", solo
//     de la columna izquierda del comprobante (a la derecha va el QR).
//
// Es una ayuda: si no se puede leer, devuelve null y el taller escribe su
// dirección como siempre. Nunca bloquea el registro.

const fs = require('fs');
const os = require('os');
const path = require('path');
const Jimp = require('jimp');

const ESTADOS = [
  'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar', 'Carabobo',
  'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón', 'Guárico', 'La Guaira',
  'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre',
  'Táchira', 'Trujillo', 'Yaracuy', 'Zulia',
];
// Nombres que aparecen en comprobantes viejos o en la dirección.
const ALIAS_ESTADO = { VARGAS: 'La Guaira', CARACAS: 'Distrito Capital', 'DTTO CAPITAL': 'Distrito Capital' };

const MAX_CARACTERES = 300;
// Sin esta memoria libre no se hace OCR (≈200 MB por lectura). En Linux
// os.freemem() es la memoria disponible; se puede ajustar con OCR_MEMORIA_MINIMA_MB.
const MEMORIA_MINIMA = Number(process.env.OCR_MEMORIA_MINIMA_MB || 350) * 1024 * 1024;
const TIEMPO_MAXIMO_OCR = 25000;
const CIERRE_POR_INACTIVIDAD = 2 * 60 * 1000;
const CONFIANZA_MINIMA = 55;

const sinAcentos = (v) => String(v || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();

/** Estado de Venezuela mencionado en la dirección (función pura). */
const estadoDesdeDireccion = (direccion) => {
  const t = ` ${sinAcentos(direccion).replace(/[^A-Z ]/g, ' ').replace(/\s+/g, ' ')} `;
  // 1) "ESTADO MIRANDA" / "EDO. MIRANDA"
  const explicito = t.match(/\b(?:ESTADO|EDO)\s+([A-Z ]{3,30}?)(?=\s+(?:ZONA|MUNICIPIO|PARROQUIA|CIUDAD|$))/);
  const candidatos = explicito ? [explicito[1], t] : [t];
  for (const texto of candidatos) {
    let mejor = null;
    ESTADOS.forEach((e) => {
      const i = texto.lastIndexOf(` ${sinAcentos(e)} `);
      if (i >= 0 && (!mejor || i > mejor.i)) mejor = { e, i };
    });
    Object.keys(ALIAS_ESTADO).forEach((a) => {
      const i = texto.lastIndexOf(` ${a} `);
      if (i >= 0 && (!mejor || i > mejor.i)) mejor = { e: ALIAS_ESTADO[a], i };
    });
    if (mejor) return mejor.e;
  }
  return '';
};

const limpiarDireccion = (texto) =>
  String(texto || '')
    .replace(/\s+/g, ' ')
    .replace(/^DOMICILIO\s+FISCAL\s*:?\s*/i, '')
    .replace(/\s*ZONA\s+POSTAL.*$/i, '')
    .replace(/[|_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_CARACTERES);

const resultado = (direccion) => {
  const d = limpiarDireccion(direccion);
  if (d.split(' ').filter((w) => w.length > 1).length < 3) return null;
  return { direccion: d, estado: estadoDesdeDireccion(d) };
};

/** Domicilio en el texto de un PDF del SENIAT (función pura). */
const domicilioDesdeTexto = (texto) => {
  const plano = String(texto || '').replace(/\r/g, '').replace(/\n/g, ' ');
  const m = plano.match(/DOMICILIO\s+FISCAL\s*:?\s*(.*?)\s*ZONA\s+POSTAL/i);
  return m ? resultado(m[1]) : null;
};

/**
 * Domicilio a partir de las palabras del OCR con su posición (función pura).
 * @param {Array<{text: string, bbox: {x0:number,y0:number,x1:number,y1:number}}>} palabras
 */
const domicilioDesdePalabras = (palabras) => {
  const lista = (palabras || []).filter((p) => p && p.text && p.bbox);
  if (!lista.length) return null;
  const ancho = Math.max(...lista.map((p) => p.bbox.x1));
  const inicio = lista.find((p) => /^DOMICILIO/i.test(p.text));
  if (!inicio) return null;
  const fin = lista.find((p) => /^ZONA$/i.test(p.text) && p.bbox.y0 >= inicio.bbox.y0 - 5);
  const y0 = inicio.bbox.y0 - 8;
  const y1 = fin ? fin.bbox.y1 + 8 : inicio.bbox.y1 + 140;
  const bloque = lista.filter(
    (p) => p.bbox.y0 >= y0 && p.bbox.y1 <= y1 && p.bbox.x0 >= inicio.bbox.x0 - 20 && p.bbox.x1 <= ancho * 0.66,
  );
  bloque.sort((a, b) => (Math.abs(a.bbox.y0 - b.bbox.y0) < 12 ? a.bbox.x0 - b.bbox.x0 : a.bbox.y0 - b.bbox.y0));
  return resultado(bloque.map((p) => p.text).join(' '));
};

// ── OCR: un solo lector, una imagen a la vez ────────────────────────────────
let lector = null; // Promise<worker>
let temporizadorCierre = null;
let cola = Promise.resolve();

const obtenerLector = () => {
  if (!lector) {
    // Se carga solo cuando hace falta: así el servidor arranca igual si la
    // librería no está instalada.
    const { createWorker } = require('tesseract.js');
    // El idioma (español) se descarga la primera vez y queda guardado aquí.
    const cachePath = path.join(__dirname, '..', '..', '.cache-ocr');
    fs.mkdirSync(cachePath, { recursive: true });
    lector = createWorker('spa', 1, {
      cachePath,
      logger: () => {},
      errorHandler: () => {},
    }).catch((e) => {
      lector = null;
      throw e;
    });
  }
  return lector;
};

const programarCierre = () => {
  clearTimeout(temporizadorCierre);
  temporizadorCierre = setTimeout(async () => {
    const actual = lector;
    lector = null;
    if (actual) (await actual.catch(() => null))?.terminate().catch(() => {});
  }, CIERRE_POR_INACTIVIDAD);
  if (temporizadorCierre.unref) temporizadorCierre.unref();
};

const conLimiteDeTiempo = (promesa, ms) =>
  Promise.race([promesa, new Promise((_, rechazar) => setTimeout(() => rechazar(new Error('ocr_tiempo')), ms))]);

const reconocer = async (buffer) => {
  const imagen = await Jimp.read(buffer);
  const lado = Math.max(imagen.bitmap.width, imagen.bitmap.height);
  if (lado > 2000) imagen.scale(2000 / lado);
  imagen.greyscale();
  const png = await imagen.getBufferAsync(Jimp.MIME_PNG);
  const worker = await obtenerLector();
  const { data } = await worker.recognize(png, {}, { blocks: true });
  const palabras = [];
  (data.blocks || []).forEach((b) =>
    (b.paragraphs || []).forEach((p) => (p.lines || []).forEach((l) => (l.words || []).forEach((w) => palabras.push(w)))),
  );
  if ((data.confidence || 0) < CONFIANZA_MINIMA) return null;
  return domicilioDesdePalabras(palabras);
};

/** Domicilio de una foto del RIF. null si no se puede (o no conviene) leer. */
const domicilioDesdeImagen = (buffer) => {
  if (os.freemem() < MEMORIA_MINIMA) return Promise.resolve(null);
  const tarea = cola.then(async () => {
    try {
      return await conLimiteDeTiempo(reconocer(buffer), TIEMPO_MAXIMO_OCR);
    } catch (e) {
      if (e && e.message === 'ocr_tiempo') {
        // Un lector colgado se descarta para que no frene a los siguientes.
        const actual = lector;
        lector = null;
        if (actual) actual.then((w) => w.terminate()).catch(() => {});
      }
      console.error('domicilioDesdeImagen:', e && e.message);
      return null;
    } finally {
      programarCierre();
    }
  });
  cola = tarea.catch(() => null);
  return tarea;
};

module.exports = {
  domicilioDesdeTexto,
  domicilioDesdePalabras,
  domicilioDesdeImagen,
  estadoDesdeDireccion,
  ESTADOS,
};
