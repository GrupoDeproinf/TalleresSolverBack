// Catálogo de servicios que usa el registro de negocios (lista del cliente).
//
// Ocho áreas con sus servicios. El negocio elige los servicios que hace
// (selector de burbujas en la app) y puede agregar otros que no estén.
// Para que los conductores lo sigan encontrando, cada área se relaciona con
// las categorías que ya existen en el panel (colección Categorias): al
// registrarse, el negocio queda asociado a esas categorías.

const { db } = require('../firebase');

const CATALOGO = [
  {
    id: 'mantenimiento',
    nombre: 'Mantenimiento preventivo',
    icono: 'oil',
    servicios: [
      'Cambio de aceite y filtro',
      'Filtro de aire y de cabina',
      'Filtro de combustible',
      'Líquido de frenos y de dirección',
      'Refrigerante y anticongelante',
      'Afinación mayor y menor',
      'Revisión de puntos de seguridad',
      'Bujías y cables de encendido',
    ],
    relacionadas: ['cambio de aceite', 'mecanica'],
  },
  {
    id: 'frenos',
    nombre: 'Frenos',
    icono: 'car-brake-alert',
    servicios: ['Pastillas de freno', 'Rectificado de discos', 'Bomba de freno y bombines', 'Sistema ABS'],
    relacionadas: ['frenos'],
  },
  {
    id: 'suspension',
    nombre: 'Tren delantero, suspensión y dirección',
    icono: 'steering',
    servicios: [
      'Alineación computarizada',
      'Balanceo de neumáticos',
      'Rotación de neumáticos',
      'Amortiguadores y resortes',
      'Terminales, rótulas y bieletas',
      'Bujes y horquillas',
      'Cremallera de dirección',
    ],
    relacionadas: ['tren delantero', 'direccion y suspension', 'neumaticos'],
  },
  {
    id: 'electrico',
    nombre: 'Eléctrico y electrónico',
    icono: 'car-battery',
    servicios: [
      'Batería: prueba, carga y cambio',
      'Alternador',
      'Motor de arranque',
      'Escáner y luz de Check Engine',
      'Diagnóstico de sensores',
      'Bombillos, faros y calaveras',
      'Vidrios eléctricos y seguros',
    ],
    relacionadas: ['electroauto', 'escaneo', 'ecu', 'alarmas'],
  },
  {
    id: 'climatizacion',
    nombre: 'Aire acondicionado',
    icono: 'snowflake',
    servicios: [
      'Recarga de gas refrigerante',
      'Detección de fugas',
      'Compresor de aire acondicionado',
      'Condensador o evaporador',
      'Limpieza de ductos',
    ],
    relacionadas: ['aire acondicionado'],
  },
  {
    id: 'motor',
    nombre: 'Mecánica de motor',
    icono: 'engine',
    servicios: [
      'Correa o cadena de tiempo',
      'Correas de accesorios',
      'Empacadura de cámara',
      'Fugas de aceite',
      'Ajuste o reconstrucción de motor',
    ],
    relacionadas: ['mecanica', 'inyectores', 'radiadores', 'metalmecanica'],
  },
  {
    id: 'transmision',
    nombre: 'Caja y embrague',
    icono: 'car-shift-pattern',
    servicios: [
      'Kit de embrague (clutch)',
      'Aceite de caja sincrónica',
      'Diagnóstico de caja automática',
      'Aceite y filtro de caja automática',
      'Reparación de caja automática',
      'Juntas homocinéticas y cubrepolvos',
      'Semiejes (tripoides)',
      'Diferencial',
    ],
    relacionadas: ['mecanica'],
  },
  {
    id: 'escape',
    nombre: 'Escape y emisiones',
    icono: 'pipe',
    servicios: ['Silenciadores y tubos', 'Soldadura de soportes', 'Catalizador', 'Válvula EGR'],
    relacionadas: ['silenciadores', 'escape'],
  },
];

const sinAcentos = (v) =>
  String(v || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

let cache = { en: 0, categorias: [] };
const categoriasActivas = async () => {
  if (Date.now() - cache.en < 10 * 60 * 1000) return cache.categorias;
  const snap = await db.collection('Categorias').get();
  cache = {
    en: Date.now(),
    categorias: snap.docs
      .map((d) => ({ uid: d.id, ...(d.data() || {}) }))
      .filter((c) => c.estatus !== false && String(c.nombre || '').trim())
      .map((c) => ({ uid: c.uid, nombre: String(c.nombre).trim() })),
  };
  return cache.categorias;
};

/** Categorías del panel que corresponden a un área del catálogo. */
const categoriasDeGrupo = (grupo, categorias) =>
  categorias.filter((c) => {
    // Coincide al comienzo de una palabra: "mecanica" no debe tomar "Metalmecanica".
    const n = ` ${sinAcentos(c.nombre)}`;
    return (grupo.relacionadas || []).some((r) => n.includes(` ${r}`) || r === 'metalmecanica' && n.includes(r));
  });

/** Catálogo con las categorías del panel ya resueltas. */
const catalogoResuelto = async () => {
  const categorias = await categoriasActivas().catch(() => []);
  return CATALOGO.map((g) => ({
    id: g.id,
    nombre: g.nombre,
    icono: g.icono,
    servicios: g.servicios,
    categorias: categoriasDeGrupo(g, categorias),
  }));
};

/** GET /api/usuarios/catalogoServicios  (pública: se usa en el registro) */
const obtenerCatalogo = async (req, res) => {
  try {
    return res.status(200).send({ grupos: await catalogoResuelto() });
  } catch (error) {
    console.error('catalogoServicios:', error && error.message);
    return res.status(500).send({ message: 'No pudimos cargar los servicios.' });
  }
};

const texto = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max);

/**
 * Limpia lo que envía la app: [{grupo, servicio, personalizado}] → máx. 80.
 * Los servicios del catálogo se aceptan tal cual; los personalizados como
 * texto corto. Función pura.
 */
const limpiarEspecialidades = (lista) => {
  const ids = new Set(CATALOGO.map((g) => g.id));
  const vistos = new Set();
  const salida = [];
  (Array.isArray(lista) ? lista : []).forEach((e) => {
    const grupo = ids.has(e && e.grupo) ? e.grupo : 'otros';
    const servicio = texto(e && e.servicio, 60);
    if (!servicio) return;
    const k = `${grupo}|${sinAcentos(servicio)}`;
    if (vistos.has(k)) return;
    vistos.add(k);
    const delCatalogo = CATALOGO.some((g) => g.id === grupo && g.servicios.includes(servicio));
    salida.push({ grupo, servicio, personalizado: !delCatalogo });
  });
  return salida.slice(0, 80);
};

/** Categorías del panel que corresponden a las especialidades elegidas. */
const categoriasDeEspecialidades = async (especialidades) => {
  const categorias = await categoriasActivas().catch(() => []);
  const grupos = new Set(especialidades.map((e) => e.grupo));
  const porUid = new Map();
  CATALOGO.filter((g) => grupos.has(g.id)).forEach((g) =>
    categoriasDeGrupo(g, categorias).forEach((c) => porUid.set(c.uid, c)),
  );
  return [...porUid.values()];
};

module.exports = {
  CATALOGO,
  obtenerCatalogo,
  catalogoResuelto,
  limpiarEspecialidades,
  categoriasDeEspecialidades,
};
