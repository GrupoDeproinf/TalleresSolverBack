// Resumen del negocio para el inicio del taller en la app (Req. 005).
//
// El taller es un usuario administrativo: al entrar debe ver cómo va su
// negocio, no el catálogo que ven los conductores. Este punto junta en una
// sola respuesta lo que ya registra la plataforma:
//   · visitas a su perfil         (colección perfilViews)
//   · contactos de conductores    (servicesContact: llamadas, WhatsApp, etc.)
//   · propuestas que ha enviado   (Propuestas)
//   · sus servicios               (Servicios)
//   · estado del negocio y plan   (Usuarios)
// No calcula ventas ni ingresos: la plataforma no registra cobros de servicios.

const { db } = require('../firebase');

const DIA = 86400000;

const aFecha = (v) => {
  if (!v) return null;
  if (typeof v.toDate === 'function') return v.toDate();
  if (typeof v._seconds === 'number') return new Date(v._seconds * 1000);
  if (typeof v.seconds === 'number') return new Date(v.seconds * 1000);
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

/** Día local de Venezuela (UTC-4) como 'AAAA-MM-DD'. */
const diaVE = (d) => new Date(d.getTime() - 4 * 3600000).toISOString().slice(0, 10);

const contarPorPeriodo = (fechas, ahora) => {
  const t = ahora.getTime();
  const validas = fechas.filter(Boolean);
  return {
    total: fechas.length,
    ultimos7: validas.filter((f) => t - f.getTime() <= 7 * DIA).length,
    ultimos30: validas.filter((f) => t - f.getTime() <= 30 * DIA).length,
    // 30 días anteriores a los últimos 30: para saber si va subiendo o bajando
    previos30: validas.filter((f) => t - f.getTime() > 30 * DIA && t - f.getTime() <= 60 * DIA).length,
  };
};

/** Serie de los últimos 7 días, del más antiguo al de hoy. */
const seriePorDia = (fechas, ahora) => {
  const dias = [];
  for (let i = 6; i >= 0; i -= 1) dias.push(diaVE(new Date(ahora.getTime() - i * DIA)));
  const conteo = dias.reduce((acc, d) => ({ ...acc, [d]: 0 }), {});
  fechas.filter(Boolean).forEach((f) => {
    const d = diaVE(f);
    if (d in conteo) conteo[d] += 1;
  });
  return dias.map((d) => ({ dia: d, cantidad: conteo[d] }));
};

/** Arma el resumen a partir de los datos crudos. Función pura. */
const armarResumen = ({ usuario, vistas, contactos, propuestas, servicios, ahora = new Date() }) => {
  const u = usuario || {};
  const sub = u.subscripcion_actual || null;

  const fVistas = vistas.map((v) => aFecha(v.fecha_creacion));
  const fContactos = contactos.map((c) => aFecha(c.fecha_creacion));
  const fPropuestas = propuestas.map((p) => aFecha(p.fecha_propuesta || p.fecha_creacion));

  // Servicios por los que más contactan, en los últimos 30 días
  const porServicio = {};
  contactos.forEach((c) => {
    const f = aFecha(c.fecha_creacion);
    if (!f || ahora.getTime() - f.getTime() > 30 * DIA) return;
    const nombre = String(c.nombre_servicio || '').trim() || 'Perfil del taller';
    porServicio[nombre] = (porServicio[nombre] || 0) + 1;
  });
  const topServicios = Object.entries(porServicio)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 3);

  const publicados = servicios.filter((s) => s.estatus === true).length;
  const fin = sub ? aFecha(sub.fecha_fin) : null;
  const cupo = sub ? parseInt(sub.cantidad_servicios, 10) : NaN;

  return {
    negocio: {
      nombre: String(u.nombre || ''),
      status: String(u.status || ''),
    },
    visitas: { ...contarPorPeriodo(fVistas, ahora), porDia: seriePorDia(fVistas, ahora) },
    contactos: { ...contarPorPeriodo(fContactos, ahora), topServicios },
    propuestas: contarPorPeriodo(fPropuestas, ahora),
    servicios: {
      total: servicios.length,
      publicados,
      sinPublicar: servicios.length - publicados,
      cupoRestante: Number.isFinite(cupo) ? Math.max(0, cupo) : null,
    },
    plan: sub
      ? {
          nombre: String(sub.nombre || ''),
          status: String(sub.status || ''),
          pendienteInicio: sub.pendiente_inicio === true,
          fechaFin: fin ? fin.toISOString() : null,
          diasRestantes: fin ? Math.max(0, Math.ceil((fin.getTime() - ahora.getTime()) / DIA)) : null,
        }
      : null,
    generadoEn: ahora.toISOString(),
  };
};

/** POST /api/usuarios/resumenTaller  Body: { uid } */
const resumenTaller = async (req, res) => {
  try {
    const uid = String((req.body && req.body.uid) || '').trim();
    if (!uid) return res.status(400).send({ message: 'El UID es obligatorio.' });

    const de = (coleccion) => db.collection(coleccion).where('uid_taller', '==', uid).get();
    const [usuarioSnap, vistas, contactos, propuestas, servicios] = await Promise.all([
      db.collection('Usuarios').doc(uid).get(),
      de('perfilViews'),
      de('servicesContact'),
      de('Propuestas'),
      de('Servicios'),
    ]);

    if (!usuarioSnap.exists || (usuarioSnap.data() || {}).typeUser !== 'Taller') {
      return res.status(404).send({ message: 'No encontramos el negocio.' });
    }

    const datos = (snap) => snap.docs.map((d) => d.data());
    return res.status(200).send(
      armarResumen({
        usuario: usuarioSnap.data(),
        vistas: datos(vistas),
        contactos: datos(contactos),
        propuestas: datos(propuestas),
        servicios: datos(servicios),
      }),
    );
  } catch (error) {
    console.error('resumenTaller:', error && error.message);
    return res.status(500).send({ message: 'No pudimos cargar el resumen.' });
  }
};

module.exports = { resumenTaller, armarResumen };
