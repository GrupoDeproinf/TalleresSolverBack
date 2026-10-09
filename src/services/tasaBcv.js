// Tasa oficial del BCV (Bs por USD) para la validación de pagos.
//
// El BCV publica cada tasa con una "fecha valor" (el día en que rige). Aquí se
// guarda una por día en `TasasBCV/{AAAA-MM-DD}` y la tasa de un día cualquiera
// es la más reciente con fecha valor igual o anterior (fines de semana y
// feriados usan la del último día hábil publicado).
//
// Fuentes, en este orden:
//   1. Página oficial del BCV (trae la fecha valor, incluso la del día siguiente).
//   2. ve.dolarapi.com (respaldo, y de donde sale el histórico).
// Una tasa corregida a mano desde el panel (manual: true) nunca se pisa.
//
// Cada pago reportado guarda una copia de la tasa y de sus montos, de modo que
// el histórico no cambia si después se corrige o publica otra tasa.

const https = require('https');
const axios = require('axios');
const { db } = require('../firebase');

const COLECCION = 'TasasBCV';
const IVA = 0.16;
const URL_BCV = 'https://www.bcv.org.ve/';
const URL_API = 'https://ve.dolarapi.com/v1/dolares/oficial';
const URL_API_HISTORICO = 'https://ve.dolarapi.com/v1/historicos/dolares/oficial';
// Cuánto puede variar una tasa nueva respecto a la anterior para aceptarla sola.
const VARIACION_MAXIMA = 0.2;
const DIAS_HISTORICO = 400;

// El servidor del BCV no envía su cadena de certificados completa y Node la
// rechaza. Se acepta solo para esta lectura, y lo leído se compara con la tasa
// anterior antes de guardarse (ver esPlausible).
const agenteBcv = new https.Agent({ rejectUnauthorized: false });

/** Día local de Venezuela (UTC-4) como 'AAAA-MM-DD'. */
const diaVE = (d = new Date()) => new Date(d.getTime() - 4 * 3600000).toISOString().slice(0, 10);
const esDia = (v) => /^\d{4}-\d{2}-\d{2}$/.test(String(v || ''));
const redondear = (n, dec = 2) => Math.round((Number(n) + Number.EPSILON) * 10 ** dec) / 10 ** dec;

/** "876,79760000" → 876.7976 */
const numeroBcv = (txt) => {
  const n = Number(String(txt || '').trim().replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
};

/** Extrae { tasa, fecha } del HTML de la página del BCV. Función pura. */
const leerPaginaBcv = (html) => {
  const texto = String(html || '');
  const bloque = texto.match(/id="dolar"[\s\S]{0,1500}?<strong[^>]*>\s*([\d.,]+)\s*<\/strong>/i);
  const tasa = bloque ? numeroBcv(bloque[1]) : null;
  const fechaM = texto.match(/Fecha Valor[\s\S]{0,400}?content="(\d{4}-\d{2}-\d{2})/i);
  if (!tasa || !fechaM) return null;
  return { tasa: redondear(tasa, 4), fecha: fechaM[1] };
};

const consultarBcv = async () => {
  const r = await axios.get(URL_BCV, {
    timeout: 25000,
    httpsAgent: agenteBcv,
    headers: { 'User-Agent': 'Mozilla/5.0 (SolversApp)' },
    responseType: 'text',
  });
  const leido = leerPaginaBcv(r.data);
  if (!leido) throw new Error('No se pudo leer la tasa en la página del BCV');
  return { ...leido, fuente: 'bcv' };
};

const consultarApi = async () => {
  const r = await axios.get(URL_API, { timeout: 20000 });
  const tasa = Number(r.data && r.data.promedio);
  const fecha = String((r.data && r.data.fechaActualizacion) || '').slice(0, 10);
  if (!Number.isFinite(tasa) || tasa <= 0 || !esDia(fecha)) throw new Error('Respuesta inesperada de dolarapi');
  return { tasa: redondear(tasa, 4), fecha, fuente: 'dolarapi' };
};

/** Tasa vigente para un día: la más reciente con fecha valor <= ese día. */
const tasaVigente = async (fecha) => {
  const dia = esDia(fecha) ? fecha : diaVE();
  const snap = await db.collection(COLECCION).where('fecha', '<=', dia).orderBy('fecha', 'desc').limit(1).get();
  if (snap.empty) return null;
  const d = snap.docs[0].data();
  const tasa = Number(d.tasa);
  if (!Number.isFinite(tasa) || tasa <= 0) return null;
  return { tasa, fecha: d.fecha, fuente: d.fuente || '', manual: d.manual === true };
};

const esPlausible = (tasa, referencia) => {
  if (!referencia) return true;
  return Math.abs(tasa - referencia) / referencia <= VARIACION_MAXIMA;
};

/** Guarda una tasa si no hay una manual para ese día. Devuelve si escribió. */
const guardarTasa = async ({ tasa, fecha, fuente }) => {
  const ref = db.collection(COLECCION).doc(fecha);
  const previo = await ref.get();
  if (previo.exists) {
    const p = previo.data() || {};
    if (p.manual === true) return false;
    if (Number(p.tasa) === tasa) return false;
    // La página del BCV es la referencia; el respaldo no la corrige.
    if (p.fuente === 'bcv' && fuente !== 'bcv') return false;
  }
  await ref.set({ fecha, tasa, fuente, manual: false, actualizadoEn: new Date() }, { merge: true });
  return true;
};

/** Carga el histórico la primera vez (para los pagos anteriores a esta función). */
const cargarHistorico = async () => {
  const hay = await db.collection(COLECCION).limit(30).get();
  if (hay.size >= 30) return 0;
  const r = await axios.get(URL_API_HISTORICO, { timeout: 30000 });
  const desde = diaVE(new Date(Date.now() - DIAS_HISTORICO * 86400000));
  const existentes = new Set(hay.docs.map((d) => d.id));
  const filas = (Array.isArray(r.data) ? r.data : []).filter(
    (f) => f && esDia(f.fecha) && f.fecha >= desde && Number(f.promedio) > 0 && !existentes.has(f.fecha),
  );
  for (let i = 0; i < filas.length; i += 400) {
    const batch = db.batch();
    filas.slice(i, i + 400).forEach((f) => {
      batch.set(db.collection(COLECCION).doc(f.fecha), {
        fecha: f.fecha,
        tasa: redondear(f.promedio, 4),
        fuente: 'dolarapi',
        manual: false,
        actualizadoEn: new Date(),
      });
    });
    await batch.commit();
  }
  return filas.length;
};

/** Tarea programada: consulta las fuentes y guarda lo nuevo. Nunca lanza. */
const actualizarTasa = async () => {
  const resumen = { guardadas: [], errores: [], historico: 0 };
  try {
    resumen.historico = await cargarHistorico();
  } catch (e) {
    resumen.errores.push(`historico: ${e && e.message}`);
  }

  const lecturas = await Promise.all(
    [consultarBcv, consultarApi].map((f) =>
      f().catch((e) => {
        resumen.errores.push(e && e.message);
        return null;
      }),
    ),
  );
  const [bcv, api] = lecturas;

  let referencia = null;
  try {
    const ultima = await tasaVigente(diaVE(new Date(Date.now() + 10 * 86400000)));
    referencia = ultima ? ultima.tasa : null;
  } catch (e) {
    resumen.errores.push(`referencia: ${e && e.message}`);
  }

  for (const l of [api, bcv]) {
    if (!l) continue;
    // Si una lectura se aleja mucho de la anterior, solo se acepta si la otra
    // fuente la confirma.
    const otra = l === bcv ? api : bcv;
    const confirmada = otra && esPlausible(l.tasa, otra.tasa);
    if (!esPlausible(l.tasa, referencia) && !confirmada) {
      resumen.errores.push(`${l.fuente}: tasa ${l.tasa} descartada por variación inusual`);
      continue;
    }
    try {
      if (await guardarTasa(l)) resumen.guardadas.push(`${l.fecha}=${l.tasa} (${l.fuente})`);
    } catch (e) {
      resumen.errores.push(`${l.fuente}: ${e && e.message}`);
    }
  }
  return resumen;
};

/**
 * Montos de un pago a partir del precio del plan (sin IVA) y la tasa.
 * Función pura. El taller paga el total con IVA.
 */
const calcularMontos = (precioPlan, tasa) => {
  const subtotal = Number(String(precioPlan == null ? '' : precioPlan).replace(',', '.'));
  if (!Number.isFinite(subtotal) || subtotal < 0) return null;
  const iva = redondear(subtotal * IVA);
  const total = redondear(subtotal + iva);
  const t = Number(tasa);
  return {
    subtotal: redondear(subtotal),
    iva,
    total,
    iva_porcentaje: IVA * 100,
    monto_bs: Number.isFinite(t) && t > 0 ? redondear(total * t) : null,
  };
};

/** Datos que se copian en el pago al reportarlo. Nunca lanza. */
const fotoParaPago = async (precioPlan, fecha) => {
  const dia = esDia(fecha) ? fecha : diaVE();
  let vigente = null;
  try {
    vigente = await tasaVigente(dia);
  } catch (e) {
    console.error('tasaBcv.fotoParaPago:', e && e.message);
  }
  const montos = calcularMontos(precioPlan, vigente ? vigente.tasa : null);
  if (!montos) return {};
  return {
    ...montos,
    tasa_bcv: vigente ? vigente.tasa : null,
    tasa_fecha: vigente ? vigente.fecha : null,
  };
};

/** GET /api/usuarios/tasaBcv?fecha=AAAA-MM-DD&monto=35  (pública) */
const obtenerTasa = async (req, res) => {
  try {
    const fecha = esDia(req.query && req.query.fecha) ? req.query.fecha : diaVE();
    let vigente = await tasaVigente(fecha);
    if (!vigente) {
      await actualizarTasa();
      vigente = await tasaVigente(fecha);
    }
    if (!vigente) return res.status(503).send({ message: 'La tasa del BCV no está disponible en este momento.' });
    const monto = req.query && req.query.monto;
    return res.status(200).send({
      tasa: vigente.tasa,
      fecha: vigente.fecha,
      consultada: fecha,
      iva_porcentaje: IVA * 100,
      ...(monto !== undefined && monto !== '' ? { montos: calcularMontos(monto, vigente.tasa) } : {}),
    });
  } catch (error) {
    console.error('tasaBcv:', error && error.message);
    return res.status(500).send({ message: 'No pudimos consultar la tasa.' });
  }
};

module.exports = {
  obtenerTasa,
  actualizarTasa,
  tasaVigente,
  fotoParaPago,
  calcularMontos,
  leerPaginaBcv,
  diaVE,
  IVA,
};
