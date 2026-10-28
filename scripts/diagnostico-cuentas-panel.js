// Diagnóstico de SOLO LECTURA para las reglas nuevas de Firestore.
//
// Las reglas reconocen al personal de Solvers por su uid de Firebase Auth:
// Admins/{uid} o Usuarios/{uid} con typeUser Certificador/Soporte. Este script
// cuenta cuántas cuentas del personal tienen el documento con otro id (esas
// no podrían entrar con las reglas nuevas) y cuántos talleres hay.
// No escribe nada. No muestra correos completos.
//
//   cd /var/www/html/TalleresSolverBack && node scripts/diagnostico-cuentas-panel.js
const { admin, db } = require('../src/firebase');

const ocultar = (correo) => {
  const [u, d] = String(correo || '').split('@');
  if (!d) return '(sin correo)';
  return `${u.slice(0, 2)}***@${d}`;
};

const revisar = async (etiqueta, docs) => {
  let bien = 0;
  const mal = [];
  for (const d of docs) {
    const data = d.data() || {};
    if (String(data.status || '').trim() === 'Eliminado') continue;
    let uidAuth = null;
    try {
      uidAuth = (await admin.auth().getUserByEmail(String(data.email || '').trim())).uid;
    } catch (e) {
      uidAuth = null;
    }
    if (uidAuth && uidAuth === d.id) bien += 1;
    else mal.push(`${ocultar(data.email)} → ${uidAuth ? 'documento con otro id' : 'sin cuenta de acceso'}`);
  }
  console.log(`${etiqueta}: ${bien} correctas, ${mal.length} con problema`);
  mal.forEach((m) => console.log(`   · ${m}`));
};

(async () => {
  const admins = await db.collection('Admins').get();
  await revisar('Admins', admins.docs);
  const personal = await db.collection('Usuarios').where('typeUser', 'in', ['Certificador', 'Soporte']).get();
  await revisar('Certificadores/Soporte', personal.docs);
  const talleres = await db.collection('Usuarios').where('typeUser', '==', 'Taller').count().get();
  console.log(`Talleres registrados: ${talleres.data().count}`);
  process.exit(0);
})().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
