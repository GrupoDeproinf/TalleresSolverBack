// Lista del personal para las reglas de Firestore y Storage (Personal/{uid}).
//
// Las reglas reconocen al personal por su uid de Firebase Auth. Algunas
// cuentas antiguas (Admins o Usuarios Certificador/Soporte) tienen el
// documento con otro id, y sin esto no podrían entrar al panel. Este script
// crea Personal/{uid de Auth} para esas cuentas, y desactiva las que ya no
// sean personal o estén eliminadas. No toca Usuarios ni Admins.
//
// Sin --aplicar solo muestra lo que haría.
//   node scripts/registrar-personal.js            (ver)
//   node scripts/registrar-personal.js --aplicar  (escribir)
const { admin, db } = require('../src/firebase');

const APLICAR = process.argv.includes('--aplicar');
const ocultar = (c) => {
  const [u, d] = String(c || '').split('@');
  return d ? `${u.slice(0, 2)}***@${d}` : '(sin correo)';
};

(async () => {
  const fuentes = [];
  (await db.collection('Admins').get()).docs.forEach((d) => fuentes.push({ col: 'Admins', d, rol: 'Admin' }));
  (await db.collection('Usuarios').where('typeUser', 'in', ['Certificador', 'Soporte']).get()).docs.forEach((d) =>
    fuentes.push({ col: 'Usuarios', d, rol: d.data().typeUser }),
  );

  const deseados = new Map(); // uid de Auth → datos
  for (const { col, d, rol } of fuentes) {
    const data = d.data() || {};
    const correo = String(data.email || '').trim();
    let uidAuth = null;
    try {
      uidAuth = (await admin.auth().getUserByEmail(correo)).uid;
    } catch (e) {
      uidAuth = null;
    }
    // Solo hace falta para las cuentas cuyo documento no usa el uid de Auth.
    if (!uidAuth || uidAuth === d.id) continue;
    const activo = String(data.status || '').trim() !== 'Eliminado';
    const previo = deseados.get(uidAuth);
    if (previo && previo.activo && !activo) continue;
    deseados.set(uidAuth, { activo, rol, email: correo.toLowerCase(), documento: `${col}/${d.id}` });
  }

  const existentes = await db.collection('Personal').get();
  const cambios = [];
  deseados.forEach((v, uid) => cambios.push({ uid, datos: v }));
  existentes.docs.forEach((d) => {
    if (!deseados.has(d.id) && d.data().activo === true) {
      cambios.push({ uid: d.id, datos: { ...d.data(), activo: false } });
    }
  });

  cambios.forEach(({ datos }) =>
    console.log(`${datos.activo ? 'activar   ' : 'desactivar'} ${ocultar(datos.email)} (${datos.rol}, ${datos.documento})`),
  );
  console.log(`${cambios.length} cuentas. ${APLICAR ? 'Guardando…' : 'Nada guardado (falta --aplicar).'}`);

  if (APLICAR && cambios.length) {
    const batch = db.batch();
    cambios.forEach(({ uid, datos }) =>
      batch.set(db.collection('Personal').doc(uid), { ...datos, actualizadoEn: new Date() }, { merge: true }),
    );
    await batch.commit();
    console.log('Listo.');
  }
  process.exit(0);
})().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
