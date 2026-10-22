// Número correlativo de las solicitudes (S-000001, S-000002, …).
//
// Pedido del cliente: que cada solicitud (y el presupuesto aprobado sobre
// ella) tenga un número de referencia, para que el negocio la ubique y la
// valide con el conductor. El número se asigna en el servidor con un
// contador transaccional (`Contadores/solicitudes`), así nunca se repite
// aunque entren dos solicitudes al mismo tiempo.

const { db } = require('../firebase');

const CONTADOR = db.collection('Contadores').doc('solicitudes');

const codigo = (n) => `S-${String(n).padStart(6, '0')}`;

/** Reserva el siguiente número. */
const siguienteNumero = async () =>
  db.runTransaction(async (tx) => {
    const snap = await tx.get(CONTADOR);
    const actual = snap.exists ? Number(snap.data().ultimo) || 0 : 0;
    const n = actual + 1;
    tx.set(CONTADOR, { ultimo: n, actualizadoEn: new Date() }, { merge: true });
    return n;
  });

/** Datos a guardar en la solicitud nueva. Nunca lanza: sin número, la solicitud se guarda igual. */
const numeroParaSolicitudNueva = async () => {
  try {
    const n = await siguienteNumero();
    return { numero_solicitud: n, codigo_solicitud: codigo(n) };
  } catch (error) {
    console.error('numeroSolicitud:', error && error.message);
    return {};
  }
};

const ms = (v) => (v && typeof v.toMillis === 'function' ? v.toMillis() : 0);

/**
 * Numera, en orden de creación, las solicitudes que aún no tienen número
 * (las anteriores a esta función). Se ejecuta al arrancar; es idempotente.
 */
const numerarSolicitudesAnteriores = async () => {
  const snap = await db.collection('Solicitudes').get();
  const sinNumero = snap.docs
    .filter((d) => !Number((d.data() || {}).numero_solicitud))
    .sort((a, b) => ms(a.data().fecha_solicitud) - ms(b.data().fecha_solicitud));
  if (!sinNumero.length) return 0;

  const inicio = await db.runTransaction(async (tx) => {
    const c = await tx.get(CONTADOR);
    const ultimoContador = c.exists ? Number(c.data().ultimo) || 0 : 0;
    const maxExistente = Math.max(0, ...snap.docs.map((d) => Number((d.data() || {}).numero_solicitud) || 0));
    const base = Math.max(ultimoContador, maxExistente);
    tx.set(CONTADOR, { ultimo: base + sinNumero.length, actualizadoEn: new Date() }, { merge: true });
    return base + 1;
  });

  for (let i = 0; i < sinNumero.length; i += 400) {
    const batch = db.batch();
    sinNumero.slice(i, i + 400).forEach((d, j) => {
      const n = inicio + i + j;
      batch.update(d.ref, { numero_solicitud: n, codigo_solicitud: codigo(n) });
    });
    await batch.commit();
  }
  return sinNumero.length;
};

module.exports = { numeroParaSolicitudNueva, numerarSolicitudesAnteriores, codigo };
