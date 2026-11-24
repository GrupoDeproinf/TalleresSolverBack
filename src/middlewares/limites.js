// Límite de peticiones por IP, en memoria (la API corre en un solo proceso).
//
// - General: 600 peticiones por minuto y por IP en /api (muy por encima del
//   uso normal; frena a quien martillea la API).
// - Sensibles (entrar, registrarse, recuperar contraseña, validar RIF):
//   20 por minuto y por IP, para frenar pruebas de contraseñas y altas masivas.
//
// La IP es el ÚLTIMO valor de X-Forwarded-For: el que añade nginx con la IP
// que realmente ve. Los valores anteriores los puede inventar el cliente.
// Si la cabecera no llega, se usa la IP de la conexión (en el peor caso, la de
// nginx para todos: con el tráfico actual, ~1.500 llamadas por semana, ni así
// se alcanzan los límites).
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
  const partes = String(req.headers['x-forwarded-for'] || '').split(',').map((x) => x.trim()).filter(Boolean);
  return partes[partes.length - 1] || req.ip || (req.socket && req.socket.remoteAddress) || 'desconocida';
};

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
