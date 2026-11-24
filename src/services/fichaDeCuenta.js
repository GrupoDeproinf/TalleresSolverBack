// La ficha de Usuarios que corresponde a una cuenta de Firebase Auth.
//
// La usan el inicio de sesión (authenticateUser) y la seguridad de la API
// (middlewares/auth.js), para que las dos reconozcan SIEMPRE la misma ficha.
// Nunca se busca por correo: el correo de la ficha es editable y alguien
// podría ponerse el de otra persona.
//
//   1. Usuarios/{uidAuth}. Si existe, es esa aunque esté "Eliminado" (en ese
//      caso no da rol y la app muestra su aviso de cuenta eliminada).
//   2. Si no existe: la única ficha activa con uid_auth == uidAuth (las cuentas
//      antiguas, vinculadas con scripts/vincular-fichas-antiguas.js).
//   3. Si no hay ninguna, o hay más de una vinculada: ninguna.

const fichaDeCuenta = async (db, uidAuth) => {
  const u = await db.collection("Usuarios").doc(uidAuth).get();
  if (u.exists) {
    return { ficha: u, eliminada: (u.data() || {}).status === "Eliminado", varias: false };
  }
  const v = await db.collection("Usuarios").where("uid_auth", "==", uidAuth).limit(10).get();
  const activas = v.docs.filter((d) => (d.data() || {}).status !== "Eliminado");
  if (activas.length === 1) return { ficha: activas[0], eliminada: false, varias: false };
  return { ficha: null, eliminada: false, varias: activas.length > 1 };
};

module.exports = { fichaDeCuenta };
