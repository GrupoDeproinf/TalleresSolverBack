// Qué ficha de Usuarios devuelve el inicio de sesión cuando varias tienen el
// mismo correo (cuentas duplicadas o antiguas, o alguien que se puso el correo
// de otra persona en su ficha, que es editable).
//
// Antes se devolvía la primera que encontrara Firestore (orden por id), que no
// siempre era la de la cuenta que inicia sesión. Con la API en modo enforce,
// la app mandaría el id de una ficha que no es la suya y quedaría bloqueada.
//
// Orden de preferencia (uidAuth = uid de Firebase Auth de quien entra):
//   1. La ficha cuyo id es uidAuth.
//   2. La ficha vinculada con uid_auth == uidAuth.
//   3. La primera ficha activa (status distinto de "Eliminado").
//   4. La primera (así una cuenta eliminada sigue viendo su aviso).
// docs: arreglo de documentos de Firestore (con .id y .data()).

const activa = (d) => (d.data() || {}).status !== "Eliminado";

const elegirFicha = (docs, uidAuth) => {
  if (!Array.isArray(docs) || docs.length === 0) return null;
  return (
    docs.find((d) => d.id === uidAuth && activa(d)) ||
    docs.find((d) => (d.data() || {}).uid_auth === uidAuth && activa(d)) ||
    docs.find(activa) ||
    docs[0]
  );
};

module.exports = { elegirFicha };
