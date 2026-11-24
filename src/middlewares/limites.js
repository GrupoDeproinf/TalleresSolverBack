// Límite de peticiones por IP, en memoria (la API corre en un solo proceso).
//
// - General: 600 peticiones por minuto y por IP en /api (muy por encima del
//   uso normal; frena a quien martillea la API).
// - Sensibles (entrar, registrarse, recuperar contraseña, validar RIF):
//   20 por minuto y por IP, para frenar pruebas de contraseñas y altas masivas.
//
// La IP sale de X-Forwarded-For (la pone nginx). Si no llega y la IP es la del
// propio servidor (127.0.0.1), no se limita: si no, todos los usuarios
// compartirían la misma cuenta y se bloquearían entre sí.
// La lectura con IA tiene además su propia cuota por usuario (documentoVehiculo).

const VENTANA_MS = 60 * 1000;
const GENERAL = 600;
const SENSIBLE = 20;
const RUTAS_SENSIBLES = new Set([
  '/usuarios/authenticateUser',
  '/usuarios/SaveClient',
  '/usuarios/SaveClientGoogle',
  '/usuarios/SaveTaller',
  '/usuarios/SaveTallerExtended',
  '/usuarios/restorePass',
  '/usuarios/validarRifDocumento',
]);

const contadores = new Map(); // clave → { n, desde }

const ipDe = (req) => {
  const xff = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return xff || req.ip || (req.socket && req.socket.remoteAddress) || '';
};
const esLocal = (ip) => ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip === '';

const contar = (clave, ahora) => {
  const c = contadores.get(clave);
  if (!c || ahora - c.desde >= VENTANA_MS) {
    contadores.set(clave, { n: 1, desde: ahora });
    return 1;
  }
  c.n += 1;
  return c.n;
};

// Limpieza para que el mapa no crezca sin fin.
setInterval(() => {
  const ahora = Date.now();
  for (const [k, c] of contadores) if (ahora - c.desde >= VENTANA_MS) contadores.delete(k);
}, VENTANA_MS).unref();

const limites = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  const ip = ipDe(req);
  if (esLocal(ip)) return next();
  const ruta = (req.baseUrl + req.path).replace(/^\/api/, '').replace(/\/$/, '');
  const ahora = Date.now();
  const sensible = RUTAS_SENSIBLES.has(ruta);
  const n = sensible ? contar(`s:${ip}:${ruta}`, ahora) : contar(`g:${ip}`, ahora);
  const tope = sensible ? SENSIBLE : GENERAL;
  if (n > tope) {
    if (n === tope + 1) console.warn(`[limite] ${ruta || '/'} superó ${tope}/min (ip ${ip})`);
    res.set('Retry-After', '60');
    return res.status(429).json({ message: 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.', codigo: 'DEMASIADOS' });
  }
  return next();
};

module.exports = { limites, ipDe, RUTAS_SENSIBLES, GENERAL, SENSIBLE, _contadores: contadores };
