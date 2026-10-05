// Servicios por defecto al registrar un taller (observación 2.1).
//
// En el registro el taller elige sus categorías ("Tus servicios"). Antes eso
// solo quedaba como especialidades y el taller tenía que crear cada servicio a
// mano; muchos no lo hacían y quedaban invisibles para los conductores.
// Ahora, por cada categoría elegida, se deja un servicio ya creado que el
// taller solo tiene que completar (precio, descripción, fotos).
//
// Reglas:
//   · Se crean SIN publicar. Al aprobar el negocio el servidor publica todos
//     los servicios del taller, así que nunca se crean más que el cupo del
//     plan gratuito: si eligió 12 categorías y el plan permite 5, se crean
//     las 5 primeras, en el orden en que las eligió (la primera es la principal).
//   · Sin precio: la app lo muestra como "Precio por consultar".
//   · Si el taller ya tiene algún servicio, no se crea nada (no se duplica).

const { db } = require('../firebase');

const PLAN_GRATIS_ID = 'IPbc9VN1kmvIwrZHzNpd';
const CUPO_POR_DEFECTO = 5;

const texto = (v) => String(v == null ? '' : v).trim();

/** "CAMBIO DE ACEITE" / "cambio de aceite" → "Cambio de aceite". */
const nombreLegible = (v) => {
  const t = texto(v).toLowerCase();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : '';
};

/** Arma los documentos a crear. Función pura: no toca la base de datos. */
const armarServiciosPorDefecto = ({ uidTaller, nombreTaller, categorias, cupo, ahora = new Date() }) => {
  const limite = Number.isFinite(Number(cupo)) && Number(cupo) > 0 ? Math.floor(Number(cupo)) : CUPO_POR_DEFECTO;
  const vistos = new Set();
  const lista = [];
  (Array.isArray(categorias) ? categorias : []).forEach((c) => {
    const uid = texto(c && c.uid);
    const nombre = texto(c && c.nombre);
    if (!uid || !nombre || vistos.has(uid)) return;
    vistos.add(uid);
    lista.push({ uid, nombre });
  });

  return lista.slice(0, limite).map((c) => ({
    categoria: c.nombre,
    uid_categoria: c.uid,
    nombre_servicio: nombreLegible(c.nombre),
    descripcion: `Servicio de ${nombreLegible(c.nombre).toLowerCase()}. Edítalo para indicar tu precio y lo que incluye.`,
    precio: '',
    garantia: '',
    subcategoria: '',
    uid_subcategoria: '',
    uid_servicio: '',
    taller: texto(nombreTaller),
    uid_taller: texto(uidTaller),
    puntuacion: 0,
    estatus: false,
    service_image: [],
    porDefecto: true, // creado por el registro; el taller aún no lo ha editado
    createdAt: ahora,
  }));
};

const cupoPlanGratis = async () => {
  try {
    const plan = await db.collection('Planes').doc(PLAN_GRATIS_ID).get();
    const n = parseInt(plan.exists ? plan.data().cantidad_servicios : '', 10);
    return Number.isFinite(n) && n > 0 ? n : CUPO_POR_DEFECTO;
  } catch (e) {
    return CUPO_POR_DEFECTO;
  }
};

/**
 * Crea los servicios por defecto de un taller recién registrado.
 * Nunca lanza: un fallo aquí no debe impedir el registro.
 * @returns {Promise<{creados:number, motivo?:string}>}
 */
const crearServiciosPorDefecto = async ({ uidTaller, nombreTaller, categorias }) => {
  try {
    const uid = texto(uidTaller);
    if (!uid || !Array.isArray(categorias) || !categorias.length) return { creados: 0, motivo: 'sin_categorias' };

    const existentes = await db.collection('Servicios').where('uid_taller', '==', uid).limit(1).get();
    if (!existentes.empty) return { creados: 0, motivo: 'ya_tiene_servicios' };

    const docs = armarServiciosPorDefecto({
      uidTaller: uid,
      nombreTaller,
      categorias,
      cupo: await cupoPlanGratis(),
    });
    if (!docs.length) return { creados: 0, motivo: 'sin_categorias' };

    const batch = db.batch();
    docs.forEach((d) => {
      const ref = db.collection('Servicios').doc();
      batch.set(ref, { ...d, uid_servicio: ref.id });
    });
    await batch.commit();
    return { creados: docs.length };
  } catch (error) {
    console.error('crearServiciosPorDefecto:', error && error.message);
    return { creados: 0, motivo: 'error' };
  }
};

module.exports = { crearServiciosPorDefecto, armarServiciosPorDefecto, nombreLegible, CUPO_POR_DEFECTO };
