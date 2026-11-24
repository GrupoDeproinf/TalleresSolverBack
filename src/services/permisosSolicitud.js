// Quién puede ver o cambiar una solicitud y sus propuestas.
//
// La regla de la ruta (middlewares/auth.js) solo exige sesión; aquí se mira
// el documento: el conductor dueño (uid_usuario), el taller asignado
// (uid_taller) o el personal de Solvers. La sesión trae los dos ids de la
// persona (uid = ficha, uidAuth = Firebase Auth): vale cualquiera.
//
// Mientras la API esté en modo "report" estos controles solo registran
// (las versiones viejas de la app todavía no mandan sesión); en "enforce"
// responden 403.

const { esStaff, MODO } = require("../middlewares/auth");

const idsDeSesion = (sesion) =>
  new Set([sesion?.uid, sesion?.uidAuth].filter((v) => typeof v === "string" && v));

const esConductorDe = (sesion, solicitud) =>
  !!solicitud && idsDeSesion(sesion).has(String(solicitud.uid_usuario || ""));

const esTallerDe = (sesion, doc) =>
  !!doc && idsDeSesion(sesion).has(String(doc.uid_taller || ""));

/**
 * Devuelve true si la llamada debe cortarse (y ya respondió 403).
 * En modo report registra el motivo y deja seguir.
 */
const negar = (req, res, motivo) => {
  const quien = req.sesion ? `uid ${req.sesion.uid}, ${req.sesion.rol}` : "sin sesión";
  const ruta = (req.baseUrl || "") + (req.path || "");
  if (MODO === "enforce") {
    console.warn(`[permiso] ${ruta} → ${motivo} (${quien})`);
    res.status(403).json({ message: "No tienes permiso para esta acción.", codigo: "SIN_PERMISO" });
    return true;
  }
  console.warn(`[auth:report] ${ruta} → ${motivo} (${quien})`);
  return false;
};

module.exports = { esStaff, idsDeSesion, esConductorDe, esTallerDe, negar };
