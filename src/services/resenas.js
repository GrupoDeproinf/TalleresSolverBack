// Reseñas (calificaciones) de servicios y talleres.
//
// Antes la app mandaba el autor en el body (`usuario`) y se guardaba tal cual:
// con cualquier sesión se podía reseñar a nombre de otra persona, poner una
// puntuación de 1000 o atribuir la reseña a otro taller. Y la lectura, que es
// pública, devolvía el objeto completo del autor, con su correo.
//
// Ahora:
// - El autor sale de la sesión: su ficha en Usuarios pone el nombre y la foto.
//   El `usuario.uid` del body tiene que ser el de la sesión (id de ficha o uid
//   de Auth); el personal puede reseñar a nombre de otro.
// - La puntuación tiene que ser un número de 1 a 5.
// - Un taller no se reseña a sí mismo.
// - En la lectura pública solo salen uid, nombre y foto del autor.
//
// Mientras la API esté en "report", sin sesión se guarda como antes (las
// versiones viejas de la app no mandan sesión) y solo se registra.

const { db } = require("../firebase");
const { esStaff, idsDeSesion, negar } = require("./permisosSolicitud");

const texto = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Lo único del autor que se muestra a terceros. */
const autorPublico = (usuario) => {
  if (!usuario || typeof usuario !== "object") return usuario;
  const out = {};
  if (usuario.uid != null) out.uid = usuario.uid;
  if (usuario.id != null && out.uid == null) out.uid = usuario.id;
  if (typeof usuario.nombre === "string") out.nombre = usuario.nombre;
  if (typeof usuario.image_perfil === "string") out.image_perfil = usuario.image_perfil;
  return out;
};

/** Reseña para la respuesta pública (sin datos privados del autor). */
const resenaPublica = (doc) => {
  const d = doc.data() || {};
  return { id: doc.id, ...d, usuario: autorPublico(d.usuario) };
};

/** null si es válida; si no, el mensaje de error (400). */
const errorPuntuacion = (puntuacion) => {
  // Solo números o texto con un número limpio ("4", "4.5"); nada de true, [5]
  // ni " 5 " (Number() los aceptaría).
  const n = typeof puntuacion === "number" ? puntuacion
    : typeof puntuacion === "string" && /^\d+(\.\d+)?$/.test(puntuacion) ? Number(puntuacion)
      : NaN;
  if (!Number.isFinite(n) || n < 1 || n > 5) {
    return "La puntuación debe ser un número del 1 al 5.";
  }
  return null;
};

/**
 * Decide el autor que se guarda. Devuelve { usuario } o null si ya respondió
 * (403 en enforce). `uidTaller` es el taller reseñado.
 */
const autorDeResena = async (req, res, usuarioBody, uidTaller) => {
  const sesion = req.sesion;
  const body = usuarioBody && typeof usuarioBody === "object" ? usuarioBody : {};
  const uidBody = String(body.uid || "").trim();
  const ids = idsDeSesion(sesion);

  if (!sesion) {
    // Solo en report llega aquí sin sesión (enforce corta antes, regla AUTH).
    if (negar(req, res, "reseña sin sesión")) return null;
    return { usuario: { uid: uidBody, nombre: texto(body.nombre, 80), email: texto(body.email, 120) } };
  }
  if (!esStaff(sesion)) {
    if (uidBody && !ids.has(uidBody) && negar(req, res, "reseña a nombre de otra persona")) return null;
    if (uidTaller && ids.has(String(uidTaller)) && negar(req, res, "un taller no se reseña a sí mismo")) return null;
  }

  // El personal puede reseñar a nombre de otro; los demás, siempre a su nombre.
  const uid = esStaff(sesion) && uidBody ? uidBody : sesion.uid;
  let ficha = {};
  try {
    const f = await db.collection("Usuarios").doc(String(uid)).get();
    if (f.exists) ficha = f.data() || {};
  } catch (e) {
    console.warn("[resenas] no se pudo leer la ficha del autor", e.message);
  }
  const usuario = {
    uid,
    nombre: texto(ficha.nombre, 80) || texto(body.nombre, 80),
    email: texto(ficha.email, 120) || (uid === sesion.uid ? texto(sesion.email, 120) : "") || texto(body.email, 120),
  };
  if (typeof ficha.image_perfil === "string" && ficha.image_perfil) usuario.image_perfil = ficha.image_perfil;
  return { usuario };
};

module.exports = { autorPublico, resenaPublica, errorPuntuacion, autorDeResena };
