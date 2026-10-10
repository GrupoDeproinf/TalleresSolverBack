// Búsqueda de direcciones para colocar el pin del taller en el mapa.
//
// La app envía lo que el taller escribió ("Avenida Bolívar Norte") y el
// estado; aquí se busca en OpenStreetMap (Nominatim), que en Venezuela ubica
// calles y avenidas mucho mejor que el buscador de Mapbox. Devuelve hasta 4
// lugares con sus coordenadas. Ubica la calle, no el número del local: el
// taller termina de ajustar el pin en el mapa.
//
// Nominatim es gratuito pero pide moderación: como máximo una consulta por
// segundo e identificar la aplicación. Por eso pasa por el servidor, con
// caché, cola de una consulta a la vez y un tope por dispositivo.

const axios = require('axios');

const URL = 'https://nominatim.openstreetmap.org/search';
const AGENTE = 'SolversApp/1.4 (https://solversapp.com; info@solversapp.com)';
const ESPERA_MS = 1100;
const CACHE_MAX = 800;
const CACHE_MS = 24 * 3600 * 1000;
const TOPE_POR_MINUTO = 20;

const cache = new Map(); // clave → { en, datos }
const porIp = new Map(); // ip → [marcas de tiempo]
let cola = Promise.resolve();
let ultima = 0;

const limpiar = (v, max = 140) =>
  String(v == null ? '' : v)
    .replace(/[\u0000-\u001f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

const sinAcentos = (v) =>
  String(v || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** "Avenida Bolívar Norte, Prebo, Valencia, Carabobo" a partir de la respuesta. Función pura. */
const textoCorto = (r) => {
  const a = (r && r.address) || {};
  const partes = [
    r && r.name,
    a.road && a.road !== (r && r.name) ? a.road : null,
    a.suburb || a.neighbourhood || a.quarter,
    a.city || a.town || a.village || a.municipality,
    a.state ? String(a.state).replace(/^Estado\s+/i, '') : null,
  ]
    .map((p) => limpiar(p, 60))
    .filter(Boolean);
  const vistos = new Set();
  const unicas = partes.filter((p) => {
    const k = sinAcentos(p);
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  });
  return unicas.join(', ') || limpiar(r && r.display_name, 120);
};

/** Convierte la respuesta de Nominatim en la lista para la app. Función pura. */
const armarResultados = (filas) => {
  const salida = [];
  const vistos = new Set();
  (Array.isArray(filas) ? filas : []).forEach((r) => {
    const lat = Number(r && r.lat);
    const lng = Number(r && r.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const texto = textoCorto(r);
    const k = sinAcentos(texto);
    if (!texto || vistos.has(k)) return;
    vistos.add(k);
    salida.push({ texto, lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
  });
  return salida.slice(0, 4);
};

/** Quita lo que no ayuda a ubicar la calle: local, piso, referencias. Función pura. */
const paraBuscar = (direccion, estado) => {
  let t = limpiar(direccion)
    .replace(/\b(local|galp[oó]n|piso|oficina|ofic|nro|n[uú]mero|casa|edif(icio)?|torre|nivel)\b\.?\s*#?\s*[\w-]*/gi, ' ')
    .replace(/\b(frente a|al lado de|diagonal a|detr[aá]s de|cerca de|a \d+ ?(m|metros|cuadras?) de)\b.*$/i, ' ')
    .replace(/#\s*[\w-]+/g, ' ')
    .replace(/\bav\.?\s/gi, 'Avenida ')
    .replace(/\burb\.?\s/gi, 'Urbanización ')
    .replace(/\bc\.?c\.?\s/gi, 'Centro Comercial ')
    .replace(/\s+/g, ' ')
    .replace(/[\s,]+$/g, '')
    .trim();
  const est = limpiar(estado, 40);
  if (est && !sinAcentos(t).includes(sinAcentos(est))) t = `${t}, ${est}`;
  return t;
};

const consultar = (q) => {
  // Una consulta a la vez y separadas, como pide el servicio.
  const turno = cola.then(async () => {
    const falta = ESPERA_MS - (Date.now() - ultima);
    if (falta > 0) await new Promise((r) => setTimeout(r, falta));
    ultima = Date.now();
    const r = await axios.get(URL, {
      timeout: 12000,
      headers: { 'User-Agent': AGENTE, 'Accept-Language': 'es' },
      params: { format: 'jsonv2', countrycodes: 've', limit: 6, addressdetails: 1, q },
    });
    return r.data;
  });
  cola = turno.catch(() => {});
  return turno;
};

const dentroDelTope = (ip) => {
  const ahora = Date.now();
  const marcas = (porIp.get(ip) || []).filter((t) => ahora - t < 60000);
  if (marcas.length >= TOPE_POR_MINUTO) {
    porIp.set(ip, marcas);
    return false;
  }
  marcas.push(ahora);
  porIp.set(ip, marcas);
  if (porIp.size > 5000) porIp.clear();
  return true;
};

/** GET /api/usuarios/buscarDireccion?q=...&estado=...  (pública: se usa en el registro) */
const buscarDireccion = async (req, res) => {
  try {
    const q = paraBuscar(req.query && req.query.q, req.query && req.query.estado);
    // Se mide lo que escribió el taller, sin contar el estado.
    const escrito = sinAcentos(paraBuscar(req.query && req.query.q, '')).replace(/[^a-z0-9]/g, '');
    if (escrito.length < 6) {
      return res.status(200).send({ resultados: [] });
    }
    const clave = sinAcentos(q);
    const guardado = cache.get(clave);
    if (guardado && Date.now() - guardado.en < CACHE_MS) {
      return res.status(200).send({ resultados: guardado.datos });
    }
    const ip = String(req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim() || 'sin-ip';
    if (!dentroDelTope(ip)) return res.status(200).send({ resultados: [], ocupado: true });

    const datos = armarResultados(await consultar(q));
    if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
    cache.set(clave, { en: Date.now(), datos });
    return res.status(200).send({ resultados: datos });
  } catch (error) {
    console.error('buscarDireccion:', error && error.message);
    // Es una ayuda: si falla, la app sigue con el mapa manual.
    return res.status(200).send({ resultados: [] });
  }
};

module.exports = { buscarDireccion, armarResultados, paraBuscar, textoCorto };
