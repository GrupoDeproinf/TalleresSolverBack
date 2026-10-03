// Validación del documento RIF (Requerimiento 003).
//
// Comprueba, sin servicios externos ni costo por uso, que el comprobante de RIF
// que sube un taller corresponde al RIF (y, de forma orientativa, al nombre)
// que escribió en el registro.
//
// Cómo lee el documento:
//   · PDF original del SENIAT → trae texto real: se extrae el RIF, la razón
//     social y la fecha de vencimiento.
//   · Imagen (foto o captura) → se busca el código QR del comprobante. El QR
//     es un enlace del SENIAT cuyo parámetro `firmaAutorizadaCert` lleva el
//     RIF: [código de letra][8 dígitos][dígito verificador]-XXX.
//
// Qué NO hace: no consulta al SENIAT, así que confirma que el documento
// COINCIDE con lo declarado, no que sea auténtico. Lo que no se puede leer
// queda como `no_legible` para revisión manual del certificador; nunca bloquea
// el registro.

const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const Jimp = require('jimp');
const jsQR = require('jsqr');

const MAX_BYTES = 8 * 1024 * 1024;

// Códigos de letra del RIF: los mismos que usa el dígito verificador.
const LETRA_POR_CODIGO = { 1: 'V', 2: 'E', 3: 'J', 4: 'P', 5: 'G' };
const CODIGO_POR_LETRA = { V: 1, E: 2, J: 3, P: 4, G: 5 };

const soloDigitos = (v) => String(v == null ? '' : v).replace(/\D/g, '');

/** "J-41073612-7", "j410736127", "J 41073612 7" → { letra, numero, dv, texto } o null. */
const parseRif = (valor) => {
  const m = String(valor == null ? '' : valor)
    .toUpperCase()
    .match(/([VEJPGC])[\s.-]?(\d{8})[\s.-]?(\d)(?!\d)/);
  if (!m) return null;
  return { letra: m[1], numero: m[2], dv: m[3], texto: `${m[1]}-${m[2]}-${m[3]}` };
};

/** Dígito verificador oficial del RIF. Devuelve null si la letra no tiene código conocido. */
const digitoVerificador = (letra, numero) => {
  const codigo = CODIGO_POR_LETRA[letra];
  if (!codigo || !/^\d{8}$/.test(numero)) return null;
  const pesos = [3, 2, 7, 6, 5, 4, 3, 2];
  const suma = numero.split('').reduce((acc, d, i) => acc + Number(d) * pesos[i], codigo * 4);
  const resto = 11 - (suma % 11);
  return String(resto >= 10 ? 0 : resto);
};

const normalizarNombre = (v) =>
  String(v == null ? '' : v)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]+/g, ' ')
    // formas jurídicas y relleno que no distinguen un negocio de otro
    .replace(/\b(C A|S A|S R L|SRL|R L|F P|CA|SA|RL|FP|COMPANIA ANONIMA|SOCIEDAD ANONIMA|DE|DEL|LA|LOS|LAS|EL|Y)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Parecido entre el nombre declarado y la razón social del documento (0 a 1).
 * Es orientativo: el nombre comercial de un taller rara vez es igual a su
 * razón social, por eso nunca decide el resultado.
 */
const parecidoNombre = (declarado, documento) => {
  const a = normalizarNombre(declarado).split(' ').filter((t) => t.length > 1);
  const b = new Set(normalizarNombre(documento).split(' ').filter((t) => t.length > 1));
  if (!a.length || !b.size) return null;
  const comunes = a.filter((t) => b.has(t)).length;
  return Number((comunes / a.length).toFixed(2));
};

const parseFecha = (ddmmyyyy) => {
  const m = String(ddmmyyyy || '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`; // ISO, sin zona horaria
};

/** Separa "data:...;base64,XXXX" o base64 puro en { buffer, mime }. */
const decodificar = (base64) => {
  const texto = String(base64 || '').trim();
  const m = texto.match(/^data:([^;,]+)?(?:;[^,]*)?,(.*)$/s);
  const cuerpo = (m ? m[2] : texto).replace(/\s+/g, '');
  if (!cuerpo) return null;
  const buffer = Buffer.from(cuerpo, 'base64');
  if (!buffer.length) return null;
  return { buffer, mime: m && m[1] ? m[1].toLowerCase() : '' };
};

const esPdf = (buffer) => buffer.slice(0, 5).toString('latin1') === '%PDF-';

// ── PDF ─────────────────────────────────────────────────────────────────────
const leerPdf = async (buffer) => {
  const { text } = await pdfParse(buffer, { max: 2 });
  const plano = String(text || '').replace(/\r/g, '');
  if (!plano.trim()) return null; // PDF escaneado: no trae texto

  const rif = parseRif(plano);
  if (!rif) return null;

  // La razón social va en la misma línea que el RIF, justo después.
  let razonSocial = '';
  const linea = plano
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.toUpperCase().replace(/[\s.-]/g, '').includes(`${rif.letra}${rif.numero}${rif.dv}`));
  if (linea) {
    razonSocial = linea
      .replace(new RegExp(`${rif.letra}[\\s.-]?${rif.numero}[\\s.-]?${rif.dv}`, 'i'), '')
      .trim();
  }

  const venc = plano.match(/VENCIMIENTO\s*:?\s*(\d{2}\/\d{2}\/\d{4})/i);
  const comprobante = plano.match(/COMPROBANTE\s*:?\s*([0-9A-Z]{12,})/i);

  return {
    metodo: 'pdf_texto',
    rif,
    razonSocial,
    fechaVencimiento: venc ? parseFecha(venc[1]) : null,
    comprobante: comprobante ? comprobante[1] : null,
    esComprobanteSeniat: /REGISTRO\s+[ÚU]NICO\s+DE\s+INFORMACI[ÓO]N\s+FISCAL/i.test(plano),
  };
};

// ── Imagen: QR del comprobante ──────────────────────────────────────────────
const rifDesdeQr = (contenido) => {
  const texto = String(contenido || '');
  const firma = texto.match(/firmaAutorizadaCert=(\d)(\d{8})(\d)\b/i);
  if (!firma) return null;
  const letra = LETRA_POR_CODIGO[firma[1]] || null;
  const comprobante = texto.match(/certRif=([0-9A-Za-z]+)/i);
  return {
    metodo: 'qr',
    rif: {
      letra, // null si el código de letra no es uno de los conocidos
      numero: firma[2],
      dv: firma[3],
      texto: `${letra || '?'}-${firma[2]}-${firma[3]}`,
    },
    razonSocial: '',
    fechaVencimiento: null,
    comprobante: comprobante ? comprobante[1] : null,
    esComprobanteSeniat: /seniat\.gob\.ve/i.test(texto),
  };
};

const buscarQr = (imagen) => {
  const { data, width, height } = imagen.bitmap;
  const qr = jsQR(new Uint8ClampedArray(data.buffer, data.byteOffset, data.length), width, height, {
    inversionAttempts: 'attemptBoth',
  });
  return qr && qr.data ? qr.data : null;
};

const leerImagen = async (buffer) => {
  const original = await Jimp.read(buffer);
  const lado = Math.max(original.bitmap.width, original.bitmap.height);

  // Varios intentos: el QR ocupa poco del documento y las fotos varían mucho.
  const intentos = [
    (img) => (lado > 2200 ? img.scale(2200 / lado) : img),
    (img) => img.scale(1400 / lado),
    (img) => (lado > 2200 ? img.scale(2200 / lado) : img).greyscale().contrast(0.5),
    (img) => img.scale(Math.min(3000 / lado, 2)).greyscale().normalize(),
  ];

  for (const preparar of intentos) {
    const contenido = buscarQr(preparar(original.clone()));
    if (contenido) return rifDesdeQr(contenido); // QR leído (sea o no del SENIAT)
  }
  return null;
};

// ── Resultado ───────────────────────────────────────────────────────────────
const resultadoBase = (extra) => ({
  estado: 'no_legible',
  metodo: null,
  rifDeclarado: null,
  rifDocumento: null,
  razonSocial: null,
  parecidoNombre: null,
  fechaVencimiento: null,
  vencido: null,
  comprobante: null,
  mensaje: '',
  ...extra,
});

/**
 * @param {{ base64: string, rif?: string, nombre?: string, hoy?: Date }} entrada
 * @returns {Promise<object>} estado: 'verificado' | 'no_coincide' | 'no_legible'
 */
const validarDocumentoRif = async ({ base64, rif, nombre, hoy = new Date() }) => {
  const declarado = parseRif(rif);
  const base = { rifDeclarado: declarado ? declarado.texto : null };

  const archivo = decodificar(base64);
  if (!archivo) {
    return resultadoBase({ ...base, mensaje: 'No recibimos el documento.' });
  }
  if (archivo.buffer.length > MAX_BYTES) {
    return resultadoBase({ ...base, mensaje: 'El archivo es muy grande para revisarlo automáticamente.' });
  }

  let leido = null;
  try {
    leido = esPdf(archivo.buffer) ? await leerPdf(archivo.buffer) : await leerImagen(archivo.buffer);
  } catch (error) {
    leido = null; // archivo dañado o formato no soportado: revisión manual
  }

  if (!leido || !leido.rif) {
    return resultadoBase({
      ...base,
      mensaje: 'No pudimos leer el RIF en el documento. Lo revisará una persona de nuestro equipo.',
    });
  }

  const hoyIso = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const comun = {
    ...base,
    metodo: leido.metodo,
    rifDocumento: leido.rif.texto,
    razonSocial: leido.razonSocial || null,
    parecidoNombre: leido.razonSocial ? parecidoNombre(nombre, leido.razonSocial) : null,
    fechaVencimiento: leido.fechaVencimiento,
    vencido: leido.fechaVencimiento ? leido.fechaVencimiento < hoyIso : null,
    comprobante: leido.comprobante,
  };

  if (!declarado) {
    return resultadoBase({
      ...comun,
      mensaje: 'Leímos el documento, pero falta el RIF del registro para compararlo.',
    });
  }

  const mismosDigitos = leido.rif.numero === declarado.numero && leido.rif.dv === declarado.dv;
  // Si el QR trae un código de letra desconocido, se compara solo por dígitos.
  const mismaLetra = !leido.rif.letra || leido.rif.letra === declarado.letra;

  if (!mismosDigitos || !mismaLetra) {
    return resultadoBase({
      ...comun,
      estado: 'no_coincide',
      mensaje: `El documento es del RIF ${leido.rif.texto} y registraste ${declarado.texto}. Revisa el número o sube el documento correcto.`,
    });
  }

  return resultadoBase({
    ...comun,
    estado: 'verificado',
    mensaje: comun.vencido
      ? 'El RIF coincide con el documento, pero el comprobante está vencido.'
      : 'El RIF coincide con el documento.',
  });
};

module.exports = {
  validarDocumentoRif,
  parseRif,
  digitoVerificador,
  parecidoNombre,
  rifDesdeQr,
};
