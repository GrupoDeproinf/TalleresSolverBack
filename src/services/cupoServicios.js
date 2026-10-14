// Cupo de servicios publicados según el plan del taller (Req. 006).
//
// Antes el cupo era un contador que se sumaba o restaba según lo que enviaba
// la app, y se descuadraba: un taller con plan GRATIS (5) llegó a tener 6
// publicados y a la vez "5 disponibles". Ahora se calcula siempre con datos
// reales: total del plan menos servicios publicados, y el contador
// `subscripcion_actual.cantidad_servicios` (lo que queda) se reescribe con ese
// resultado para que la app y el panel muestren lo correcto.

const { db } = require('../firebase');

const sinAcentos = (v) =>
  String(v || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

let planesCache = { en: 0, lista: [] };
const planes = async () => {
  if (Date.now() - planesCache.en < 5 * 60 * 1000) return planesCache.lista;
  const snap = await db.collection('Planes').get();
  planesCache = { en: Date.now(), lista: snap.docs.map((d) => ({ id: d.id, ...d.data() })) };
  return planesCache.lista;
};

/** Servicios que permite el plan de la suscripción, o null si no se sabe. */
const totalDelPlan = async (sub) => {
  if (!sub) return null;
  if (sinAcentos(sub.status) === 'vencido') return 0;
  const plan = (await planes()).find((p) => sinAcentos(p.nombre) === sinAcentos(sub.nombre));
  const n = parseInt(plan ? plan.cantidad_servicios : '', 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/**
 * @returns {Promise<{total: number|null, publicados: number, restante: number|null, sub: object|null}>}
 */
const estadoCupo = async (uidTaller, { excluirId } = {}) => {
  const [userSnap, servSnap] = await Promise.all([
    db.collection('Usuarios').doc(uidTaller).get(),
    db.collection('Servicios').where('uid_taller', '==', uidTaller).where('estatus', '==', true).get(),
  ]);
  const sub = userSnap.exists ? (userSnap.data() || {}).subscripcion_actual || null : null;
  const publicados = servSnap.docs.filter((d) => d.id !== excluirId).length;
  const total = await totalDelPlan(sub);
  return { total, publicados, restante: total == null ? null : Math.max(0, total - publicados), sub };
};

/** Reescribe lo que queda del cupo con el cálculo real. Nunca lanza. */
const sincronizarCupo = async (uidTaller) => {
  try {
    const e = await estadoCupo(uidTaller);
    if (e.sub && e.restante != null && String(e.sub.cantidad_servicios) !== String(e.restante)) {
      await db
        .collection('Usuarios')
        .doc(uidTaller)
        .update({ 'subscripcion_actual.cantidad_servicios': String(e.restante) });
    }
    return e;
  } catch (error) {
    console.error('sincronizarCupo:', error && error.message);
    return null;
  }
};

const mensajeSinCupo = (total) =>
  `Tu plan permite publicar hasta ${total} ${total === 1 ? 'servicio' : 'servicios'}. ` +
  'Lo guardamos como oculto: oculta otro servicio o mejora tu plan para publicarlo.';

module.exports = { estadoCupo, sincronizarCupo, totalDelPlan, mensajeSinCupo };
