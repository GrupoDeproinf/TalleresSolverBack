// Borra el campo `password` (texto plano) de los documentos de Usuarios.
// Lo dejaba el registro antiguo del panel web. La contraseña real vive en
// Firebase Auth, así que borrarlo no afecta el inicio de sesión.
//
// Necesita la llave de servicio de Firebase (la misma del back). Por defecto
// usa firebase.json en la raíz del back (existe en el servidor, no en git).
// En otra máquina, pasa la ruta con --cred o GOOGLE_APPLICATION_CREDENTIALS.
//
// Uso:
//   node scripts/limpiar-passwords-firestore.js                     -> solo cuenta
//   node scripts/limpiar-passwords-firestore.js --apply             -> borra el campo
//   node scripts/limpiar-passwords-firestore.js --cred ~/llave.json -> otra llave
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const i = process.argv.indexOf('--cred');
const credPath = path.resolve(
  (i > -1 && process.argv[i + 1]) ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(__dirname, '..', 'firebase.json'),
);
if (!fs.existsSync(credPath)) {
  console.error(`No encuentro la llave de Firebase en ${credPath}.`);
  console.error('Córrelo en el servidor del back, o descarga una llave en Firebase > Configuración > Cuentas de servicio y usa --cred <ruta>.');
  process.exit(1);
}
const serviceAccount = JSON.parse(fs.readFileSync(credPath, 'utf8'));

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
