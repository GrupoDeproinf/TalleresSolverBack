// Vincula las fichas antiguas de Usuarios con su cuenta de Firebase Auth.
//
// En casi todas las cuentas el id de la ficha es el uid de Auth. En las
// antiguas no: el servidor las encontraba solo por correo, y el correo de la
// ficha es editable. Este script graba en esas fichas `uid_auth` (el uid de su
// cuenta de Auth, buscada por el mismo correo), que el usuario no puede
// cambiar. Ver identidadDe en src/middlewares/auth.js.
//
// Por defecto SOLO MUESTRA lo que haría. Para escribir, añadir --aplicar.
// No muestra correos completos. No toca fichas eliminadas, ni las que ya
// tienen uid_auth, ni los casos dudosos (los lista para revisarlos a mano).
//
//   cd /var/www/html/TalleresSolverBack
//   node scripts/vincular-fichas-antiguas.js            # ver
//   node scripts/vincular-fichas-antiguas.js --aplicar  # grabar
const { admin, db } = require('../src/firebase');

const APLICAR = process.argv.includes('--aplicar');

const ocultar = (correo) => {
  const [u, d] = String(correo || '').split('@');
  if (!d) return '(sin correo)';
  return `${u.slice(0, 2)}***@${d}`;
};

const main = async () => {
  const uidPorCorreo = new Map();
  let pagina;
  do {
    const r = await admin.auth().listUsers(1000, pagina);
    r.users.forEach((u) => u.email && uidPorCorreo.set(u.email.trim().toLowerCase(), u.uid));
    pagina = r.pageToken;
  } while (pagina);

  const fichas = await db.collection('Usuarios').select('email', 'typeUser', 'status', 'uid_auth').get();
  const ids = new Set(fichas.docs.map((d) => d.id));

  const candidatas = [];
  const dudosas = [];
  for (const d of fichas.docs) {
    const x = d.data() || {};
    if (String(x.status || '').trim() === 'Eliminado') continue;
    const uidAuth = uidPorCorreo.get(String(x.email || '').trim().toLowerCase());
    if (!uidAuth || uidAuth === d.id) continue;
    const quien = `${x.typeUser || '?'} ${ocultar(x.email)}`;
    if (x.uid_auth === uidAuth) continue;
    if (x.uid_auth) dudosas.push(`${quien} → ya tiene otro uid_auth`);
    else if (ids.has(uidAuth)) dudosas.push(`${quien} → su cuenta de acceso ya tiene una ficha propia`);
    else candidatas.push({ ref: d.ref, uidAuth, quien });
  }

  // Dos fichas que apuntan a la misma cuenta de Auth: no se vincula ninguna.
  const porUid = new Map();
  candidatas.forEach((c) => porUid.set(c.uidAuth, (porUid.get(c.uidAuth) || 0) + 1));
  const seguras = candidatas.filter((c) => porUid.get(c.uidAuth) === 1);
  candidatas
    .filter((c) => porUid.get(c.uidAuth) > 1)
    .forEach((c) => dudosas.push(`${c.quien} → otra ficha activa usa la misma cuenta de acceso`));

  console.log(`Fichas para vincular: ${seguras.length}`);
  seguras.forEach((c) => console.log(`   · ${c.quien}`));
  console.log(`Casos dudosos (no se tocan): ${dudosas.length}`);
  dudosas.forEach((m) => console.log(`   · ${m}`));

  if (!APLICAR) {
    console.log('\nNo se escribió nada. Para grabar: node scripts/vincular-fichas-antiguas.js --aplicar');
    return;
  }
  const lote = db.batch();
  seguras.forEach((c) => lote.update(c.ref, { uid_auth: c.uidAuth }));
  if (seguras.length) await lote.commit();
  console.log(`\nVinculadas: ${seguras.length}`);
};

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Error:', e.message);
    process.exit(1);
  });
