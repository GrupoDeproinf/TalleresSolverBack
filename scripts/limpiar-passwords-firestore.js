// Borra el campo `password` (texto plano) de los documentos de Usuarios.
// Lo dejaba el registro antiguo del panel web. La contraseña real vive en
// Firebase Auth, así que borrarlo no afecta el inicio de sesión.
//
// Uso (desde la raíz del back, donde está firebase.json):
//   node scripts/limpiar-passwords-firestore.js          -> solo cuenta (no cambia nada)
//   node scripts/limpiar-passwords-firestore.js --apply  -> borra el campo
const admin = require('firebase-admin');
const serviceAccount = require('../firebase.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const APPLY = process.argv.includes('--apply');

(async () => {
  const snap = await db.collection('Usuarios').get();
  const afectados = snap.docs.filter((d) => d.get('password') !== undefined);
  console.log(`Usuarios revisados: ${snap.size}. Con campo password: ${afectados.length}.`);
  if (!APPLY) {
    console.log('Modo prueba. Ejecuta con --apply para borrar el campo.');
    return;
  }
  for (let i = 0; i < afectados.length; i += 400) {
    const batch = db.batch();
    afectados.slice(i, i + 400).forEach((d) =>
      batch.update(d.ref, { password: admin.firestore.FieldValue.delete() }),
    );
    await batch.commit();
  }
  console.log(`Listo: campo password borrado en ${afectados.length} documentos.`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
