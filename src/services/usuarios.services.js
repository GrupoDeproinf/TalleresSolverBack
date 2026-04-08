const admin = require("firebase-admin");
const { db, bucket } = require("../firebase");
const { Buffer } = require('buffer');

const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, GeoPoint } = require("firebase-admin/firestore");
const { app } = require("../../firebaseConfig"); // Asegúrate de la ruta correcta


const sendEmail = async (email, html, subject) => {
  try {
    const axios = require("axios");

    if (!email || !html) {
      throw new Error("Email, HTML y nombre son requeridos");
    }

    const data = JSON.stringify({
      sender: {
        name: "Solvers, C.A.",
        email: "info@solversapp.com",
      },
      to: [
        {
          email: email,
        },
      ],
      htmlContent: html,
      subject: subject,
      headers: {
        "X-Mailin-track": "0",        // Desactiva todo el tracking
        "X-Mailin-track-clicks": "0", // Desactiva solo clicks
      }
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.brevo.com/v3/smtp/email",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      data: data,
    };

    const response = await axios.request(config);
    console.log("Email enviado exitosamente:", response.data);

    return {
      success: true,
      message: "Email enviado exitosamente",
      data: response.data,
    };
  } catch (error) {
    console.error("Error al enviar el email:", error);
    throw new Error(`Error al enviar el email: ${error.message}`);
  }
};


// Inicializar Firebase Auth y Firestore
const auth = getAuth(app); // Obtener la instancia de autenticación
// const db = getFirestore(); // Inicializar Firestore

const nodemailer = require("nodemailer");

const getUsuarios = async (req, res) => {
  try {
    const result = await db.collection("Usuarios").get();

    if (result.empty) {
      return res.status(404).send("No se encontraron usuarios");
    }

    const usuarios = result.docs.map((doc) => doc.data());

    res.send(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error); // Muestra el error en la consola del servidor
    res.status(500).send(`Error al obtener usuarios: ${error.message}`); // Muestra el mensaje del error
  }
};

const getNotificaciones = async (req, res) => {
  try {
    const result = await db.collection("Notificaciones").get();

    if (result.empty) {
      return res.status(200).json([]);
    }

    const notificaciones = result.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(notificaciones);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return res.status(500).send(`Error al obtener notificaciones: ${error.message}`);
  }
};

/** Solo sobrescribe claves presentes en incoming con valor !== undefined; el resto se conserva de existing. */
const mergeUsuarioNotificacionItem = (existing, incoming) => {
  const out = { ...(existing && typeof existing === "object" ? existing : {}) };
  if (!incoming || typeof incoming !== "object") return out;
  for (const key of Object.keys(incoming)) {
    if (incoming[key] !== undefined) {
      out[key] = incoming[key];
    }
  }
  return out;
};

const saveUpdateNotificationUser = async (req, res) => {
  try {
    const { uiduser, uidvehicle, notificaciones } = req.body || {};

    if (!uiduser || typeof uiduser !== "string" || uiduser.trim() === "") {
      return res.status(400).json({ error: "uiduser es requerido." });
    }
    if (!uidvehicle || typeof uidvehicle !== "string" || uidvehicle.trim() === "") {
      return res.status(400).json({ error: "uidvehicle es requerido." });
    }
    if (!Array.isArray(notificaciones)) {
      return res.status(400).json({ error: "notificaciones debe ser un arreglo." });
    }

    const userRef = db.collection("Usuarios").doc(uiduser.trim());
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const userData = userSnap.data() || {};
    const current = Array.isArray(userData.notificacionesVehiculos)
      ? userData.notificacionesVehiculos
      : [];

    const vehicleId = uidvehicle.trim();
    const idx = current.findIndex(
      (item) => item && typeof item === "object" && item.uidvehicle === vehicleId
    );

    const vehicleConfig =
      idx >= 0 && current[idx] && typeof current[idx] === "object"
        ? current[idx]
        : null;

    const currentNotificaciones = Array.isArray(vehicleConfig?.notificaciones)
      ? [...vehicleConfig.notificaciones]
      : [];

    const mergedNotificaciones = [...currentNotificaciones];
    for (const inc of notificaciones) {
      if (!inc || typeof inc !== "object") {
        return res.status(400).json({ error: "Cada elemento de notificaciones debe ser un objeto." });
      }
      const scRaw = inc.secretCode;
      if (scRaw === undefined || scRaw === null || String(scRaw).trim() === "") {
        return res.status(400).json({ error: "Cada notificación debe incluir secretCode." });
      }
      const sc = String(scRaw).trim();
      const j = mergedNotificaciones.findIndex(
        (n) => n && typeof n === "object" && String(n.secretCode).trim() === sc
      );
      if (j >= 0) {
        const merged = mergeUsuarioNotificacionItem(mergedNotificaciones[j], inc);
        merged.secretCode = sc;
        mergedNotificaciones[j] = merged;
      } else {
        const merged = mergeUsuarioNotificacionItem({ secretCode: sc }, inc);
        merged.secretCode = sc;
        mergedNotificaciones.push(merged);
      }
    }

    const vehicleNotifications = {
      ...(vehicleConfig && typeof vehicleConfig === "object" ? vehicleConfig : {}),
      uidvehicle: vehicleId,
      notificaciones: mergedNotificaciones,
    };

    let updated;
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = vehicleNotifications;
    } else {
      updated = [...current, vehicleNotifications];
    }

    await userRef.update({
      notificacionesVehiculos: updated,
    });

    return res.status(200).json({
      message: "Notificaciones del vehículo guardadas correctamente.",
      uiduser: uiduser.trim(),
      uidvehicle: vehicleId,
    });
  } catch (error) {
    console.error("Error al guardar/actualizar notificaciones de usuario:", error);
    return res
      .status(500)
      .json({ error: `Error al guardar notificaciones: ${error.message}` });
  }
};

const updateNotificationUser = async (req, res) => {
  try {
    const {
      uiduser,
      uidvehicle,
      secretCode,
      ultimaRevision,
      proximaRevision,
      ultimoKM,
      proximoKM,
      intervalodias,
      intervalokm,
      intervaloDias,
      intervaloKm,
    } = req.body || {};

    if (!uiduser || typeof uiduser !== "string" || uiduser.trim() === "") {
      return res.status(400).json({ error: "uiduser es requerido." });
    }
    if (!uidvehicle || typeof uidvehicle !== "string" || uidvehicle.trim() === "") {
      return res.status(400).json({ error: "uidvehicle es requerido." });
    }
    if (!secretCode || typeof secretCode !== "string" || secretCode.trim() === "") {
      return res.status(400).json({ error: "secretCode es requerido." });
    }

    const userRef = db.collection("Usuarios").doc(uiduser.trim());
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const userData = userSnap.data() || {};
    const current = Array.isArray(userData.notificacionesVehiculos)
      ? userData.notificacionesVehiculos
      : [];

    const vehicleId = uidvehicle.trim();
    const vehicleIndex = current.findIndex(
      (item) => item && typeof item === "object" && item.uidvehicle === vehicleId
    );

    if (vehicleIndex < 0) {
      return res.status(404).json({
        error: "No se encontró configuración de notificaciones para ese vehículo.",
      });
    }

    const vehicleConfig = current[vehicleIndex] || {};
    const currentNotificaciones = Array.isArray(vehicleConfig.notificaciones)
      ? vehicleConfig.notificaciones
      : [];

    const notifIndex = currentNotificaciones.findIndex(
      (n) => n && typeof n === "object" && n.secretCode === secretCode.trim()
    );

    if (notifIndex < 0) {
      return res.status(404).json({
        error: "No se encontró notificación para el secretCode indicado.",
      });
    }

    const updatedNotificaciones = [...currentNotificaciones];
    const dias =
      intervalodias !== undefined && intervalodias !== null
        ? intervalodias
        : intervaloDias !== undefined && intervaloDias !== null
          ? intervaloDias
          : updatedNotificaciones[notifIndex].intervalodias ??
            updatedNotificaciones[notifIndex].intervaloDias ??
            "";
    const km =
      intervalokm !== undefined && intervalokm !== null
        ? intervalokm
        : intervaloKm !== undefined && intervaloKm !== null
          ? intervaloKm
          : updatedNotificaciones[notifIndex].intervalokm ??
            updatedNotificaciones[notifIndex].intervaloKM ??
            "";

    updatedNotificaciones[notifIndex] = {
      ...updatedNotificaciones[notifIndex],
      ultimaRevision: ultimaRevision ?? updatedNotificaciones[notifIndex].ultimaRevision ?? "",
      proximaRevision:
        proximaRevision ?? updatedNotificaciones[notifIndex].proximaRevision ?? "",
      ultimoKM: ultimoKM ?? updatedNotificaciones[notifIndex].ultimoKM ?? "",
      proximoKM: proximoKM ?? updatedNotificaciones[notifIndex].proximoKM ?? "",
      intervalodias: dias,
      intervalokm: km,
    };

    const updatedVehicles = [...current];
    updatedVehicles[vehicleIndex] = {
      ...vehicleConfig,
      uidvehicle: vehicleId,
      notificaciones: updatedNotificaciones,
    };

    await userRef.update({
      notificacionesVehiculos: updatedVehicles,
    });

    return res.status(200).json({
      message: "Notificación del vehículo actualizada correctamente.",
      uiduser: uiduser.trim(),
      uidvehicle: vehicleId,
      secretCode: secretCode.trim(),
    });
  } catch (error) {
    console.error("Error al actualizar notificación de usuario:", error);
    return res
      .status(500)
      .json({ error: `Error al actualizar notificación: ${error.message}` });
  }
};

const getVehiculosByUsuarioUid = async (req, res) => {
  try {
    const { uid } = req.body || {};

    if (!uid || typeof uid !== "string" || uid.trim() === "") {
      return res.status(400).json({ error: "Se debe proporcionar el uid del usuario." });
    }

    const usuarioRef = db.collection("Usuarios").doc(uid.trim());
    const usuarioDoc = await usuarioRef.get();

    if (!usuarioDoc.exists) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const vehiculosSnapshot = await usuarioRef.collection("Vehiculos").get();

    const vehiculos = vehiculosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(vehiculos);
  } catch (error) {
    console.error("Error al obtener vehículos del usuario:", error);
    res.status(500).json({ error: `Error al obtener vehículos: ${error.message}` });
  }
};

const getTiposVehiculo = async (req, res) => {
  try {
    const snapshot = await db.collection("Tipo_Vehiculo").get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const tipos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(tipos);
  } catch (error) {
    console.error("Error al obtener tipos de vehículo:", error);
    return res
      .status(500)
      .json({ error: `Error al obtener tipos de vehículo: ${error.message}` });
  }
};

const vehiculoCoalesceEmpty = (v) => (v == null ? "" : v);

const vehiculoPayloadIsEmpty = (v) => v == null || (typeof v === "string" && v.trim() === "");

const vehiculoPayloadIsHttpUrl = (v) =>
  typeof v === "string" && /^https?:\/\//i.test(v.trim());

const vehiculoValueToTimestamp = (v) => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return admin.firestore.Timestamp.fromDate(d);
};

const vehiculoParseBase64File = (input) => {
  if (!input || typeof input !== "string" || !input.trim()) return null;
  let s = input.trim();
  let contentType = "image/jpeg";
  let ext = "jpg";
  const dataUrl = /^data:([^;]+);base64,([\s\S]+)$/i.exec(s);
  if (dataUrl) {
    contentType = dataUrl[1].split(";")[0].trim().toLowerCase();
    s = dataUrl[2].replace(/\s/g, "");
  } else {
    s = s.replace(/\s/g, "");
  }
  let buffer;
  try {
    buffer = Buffer.from(s, "base64");
  } catch {
    return null;
  }
  if (!buffer || !buffer.length) return null;
  if (dataUrl) {
    if (contentType.includes("pdf")) {
      ext = "pdf";
      contentType = "application/pdf";
    } else if (contentType.includes("png")) {
      ext = "png";
      contentType = "image/png";
    } else {
      ext = "jpg";
      contentType = "image/jpeg";
    }
  } else {
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      contentType = "image/jpeg";
      ext = "jpg";
    } else if (buffer[0] === 0x89 && buffer[1] === 0x50) {
      contentType = "image/png";
      ext = "png";
    } else if (buffer.slice(0, 4).toString("ascii") === "%PDF") {
      contentType = "application/pdf";
      ext = "pdf";
    }
  }
  return { buffer, contentType, ext };
};

const vehiculoUploadDocumentFile = async (uidTrim, vehicleId, fileBaseName, base64Input) => {
  const parsed = vehiculoParseBase64File(base64Input);
  if (!parsed) return "";
  const storagePath = `vehicles/${uidTrim}/${vehicleId}/documents/${fileBaseName}.${parsed.ext}`;
  const file = bucket.file(storagePath);
  await new Promise((resolve, reject) => {
    file.save(parsed.buffer, {
      metadata: { contentType: parsed.contentType },
      public: true,
      validation: "md5",
    }, (err) => (err ? reject(err) : resolve()));
  });
  const baseUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
  return `${baseUrl}?t=${Date.now()}`;
};

const vehiculoUploadMainImage = async (uidTrim, vehicleId, imagenBase64) => {
  if (!imagenBase64 || typeof imagenBase64 !== "string" || !imagenBase64.trim()) return "";
  let raw = imagenBase64.trim();
  const du = /^data:[^;]+;base64,([\s\S]+)$/i.exec(raw);
  if (du) raw = du[1].replace(/\s/g, "");
  else raw = raw.replace(/\s/g, "");
  const buffer = Buffer.from(raw, "base64");
  const storagePath = `vehicles/${uidTrim}/${vehicleId}/${vehicleId}.jpg`;
  const file = bucket.file(storagePath);
  await new Promise((resolve, reject) => {
    file.save(buffer, {
      metadata: { contentType: "image/jpeg" },
      public: true,
      validation: "md5",
    }, (err) => (err ? reject(err) : resolve()));
  });
  const baseUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
  return `${baseUrl}?t=${Date.now()}`;
};

/** Crear: solo sube si hay base64; URL http(s) o vacío se ignoran para la subida. */
const vehiculoAppendCreateDocUrl = async (docUrlUpdates, uidTrim, vehicleId, raw, urlKey, fileBase) => {
  if (vehiculoPayloadIsEmpty(raw)) return;
  if (vehiculoPayloadIsHttpUrl(raw)) return;
  const url = await vehiculoUploadDocumentFile(uidTrim, vehicleId, fileBase, raw);
  if (url) docUrlUpdates[urlKey] = url;
};

/** Actualizar: vacío → limpiar; URL http(s) → mantener; base64 → subir. */
const vehiculoResolveUpdateDocUrl = async (uidTrim, vehicleId, raw, urlKey, fileBase, existing) => {
  if (vehiculoPayloadIsEmpty(raw)) return "";
  if (vehiculoPayloadIsHttpUrl(raw)) return existing[urlKey] || "";
  const url = await vehiculoUploadDocumentFile(uidTrim, vehicleId, fileBase, raw);
  return url || existing[urlKey] || "";
};

const usuarioConductorUploadDoc = async (uidTrim, fileBaseName, base64Input) => {
  const parsed = vehiculoParseBase64File(base64Input);
  if (!parsed) return "";
  const storagePath = `usuarios/${uidTrim}/documentos_conductor/${fileBaseName}.${parsed.ext}`;
  const file = bucket.file(storagePath);
  await new Promise((resolve, reject) => {
    file.save(parsed.buffer, {
      metadata: { contentType: parsed.contentType },
      public: true,
      validation: "md5",
    }, (err) => (err ? reject(err) : resolve()));
  });
  const baseUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
  return `${baseUrl}?t=${Date.now()}`;
};

/** Misma regla que vehículos: vacío → limpiar; URL http(s) → mantener; base64 → subir. El nombre en Firestore = bodyKey (ej. licencia_frente_base64 guarda la URL). */
const usuarioConductorResolveDocField = async (uidTrim, raw, firestoreKey, fileBase, existing) => {
  if (vehiculoPayloadIsEmpty(raw)) return "";
  if (vehiculoPayloadIsHttpUrl(raw)) return existing[firestoreKey] || "";
  const url = await usuarioConductorUploadDoc(uidTrim, fileBase, raw);
  return url || existing[firestoreKey] || "";
};

const saveOrUpdateVehiculo = async (req, res) => {
  try {
    const body = req.body || {};
    const {
      uiduser,
      uidvehicle,
      imagen_base64,
      certificado_circulacion_frente_base64,
      certificado_circulacion_reverso_base64,
      rcv_documento_frente_base64,
      rcv_documento_reverso_base64,
      rcv_fecha_vencimiento,
      trimestres_frente_base64,
      trimestres_reverso_base64,
      trimestres_fecha_vencimiento,
    } = body;

    if (!uiduser || typeof uiduser !== "string" || uiduser.trim() === "") {
      return res.status(400).json({ error: "Se debe proporcionar uiduser." });
    }

    const uidTrim = uiduser.trim();
    const usuarioRef = db.collection("Usuarios").doc(uidTrim);
    const usuarioDoc = await usuarioRef.get();
    if (!usuarioDoc.exists) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const vehiculosRef = usuarioRef.collection("Vehiculos");
    const isCreate = !uidvehicle || (typeof uidvehicle === "string" && uidvehicle.trim() === "");

    const docData = {
      vehiculo_placa: vehiculoCoalesceEmpty(body.vehiculo_placa),
      vehiculo_marca: vehiculoCoalesceEmpty(body.vehiculo_marca),
      vehiculo_modelo: vehiculoCoalesceEmpty(body.vehiculo_modelo),
      vehiculo_anio: vehiculoCoalesceEmpty(body.vehiculo_anio),
      vehiculo_color: vehiculoCoalesceEmpty(body.vehiculo_color),
      tipo_vehiculo: vehiculoCoalesceEmpty(body.tipo_vehiculo),
      uid_tipo_vehiculo: vehiculoCoalesceEmpty(body.uid_tipo_vehiculo),

      KM: vehiculoCoalesceEmpty(body.KM),
      KM_correa_tiempo: vehiculoCoalesceEmpty(body.KM_correa_tiempo),
      KM_ultima_rotacion_cauchos: vehiculoCoalesceEmpty(body.KM_ultima_rotacion_cauchos),
      proximo_cambio_aceite: vehiculoValueToTimestamp(body.proximo_cambio_aceite),
      ultimo_cambio_bujias_filtro: vehiculoValueToTimestamp(body.ultimo_cambio_bujias_filtro),
      ultimo_cambio_pila_gasolina: vehiculoValueToTimestamp(body.ultimo_cambio_pila_gasolina),
      ultimo_lavado: vehiculoValueToTimestamp(body.ultimo_lavado),
      ultima_vez_gasolina: vehiculoValueToTimestamp(body.ultima_vez_gasolina),
      ultima_vez_alineacion: vehiculoValueToTimestamp(body.ultima_vez_alineacion),
      contratacion_RCV: vehiculoCoalesceEmpty(body.contratacion_RCV),
      grua: vehiculoCoalesceEmpty(body.grua),
      activo: vehiculoCoalesceEmpty(body.activo),
      por_defecto: vehiculoCoalesceEmpty(body.por_defecto),

      // Ficha técnica
      capacidad_tanque_combustible: vehiculoCoalesceEmpty(body.capacidad_tanque_combustible),
      cilindrada: vehiculoCoalesceEmpty(body.cilindrada),
      numero_cilindros: vehiculoCoalesceEmpty(body.numero_cilindros),
      tipo_aceite_motor: vehiculoCoalesceEmpty(body.tipo_aceite_motor),
      viscosidad_aceite_motor: vehiculoCoalesceEmpty(body.viscosidad_aceite_motor),
      marca_aceite_motor: vehiculoCoalesceEmpty(body.marca_aceite_motor),
      litros_aceite: vehiculoCoalesceEmpty(body.litros_aceite),
      tipo_aceite_diferencial: vehiculoCoalesceEmpty(body.tipo_aceite_diferencial),
      viscosidad_aceite_diferencial: vehiculoCoalesceEmpty(body.viscosidad_aceite_diferencial),
      tipo_aceite_transmision: vehiculoCoalesceEmpty(body.tipo_aceite_transmision),
      tipo_refrigerante: vehiculoCoalesceEmpty(body.tipo_refrigerante),
      tecnologia_refrigerante: vehiculoCoalesceEmpty(body.tecnologia_refrigerante),
      tipo_liga_frenos: vehiculoCoalesceEmpty(body.tipo_liga_frenos),
      amperaje_bateria: vehiculoCoalesceEmpty(body.amperaje_bateria),
      tamano_neumatico: vehiculoCoalesceEmpty(body.tamano_neumatico),
      tamano_rin: vehiculoCoalesceEmpty(body.tamano_rin),
      presion_neumatico: vehiculoCoalesceEmpty(body.presion_neumatico),
      marca_bujia: vehiculoCoalesceEmpty(body.marca_bujia),
      codigo_bujia: vehiculoCoalesceEmpty(body.codigo_bujia),
      nivel_blindaje: vehiculoCoalesceEmpty(body.nivel_blindaje),

      // Documentación (URLs en Storage; fechas como Timestamp)
      certificado_circulacion_frente_url: "",
      certificado_circulacion_reverso_url: "",
      rcv_documento_frente_url: "",
      rcv_documento_reverso_url: "",
      rcv_fecha_vencimiento: vehiculoValueToTimestamp(rcv_fecha_vencimiento),
      trimestres_frente_url: "",
      trimestres_reverso_url: "",
      trimestres_fecha_vencimiento: vehiculoValueToTimestamp(trimestres_fecha_vencimiento),
    };

    if (isCreate) {
      const newRef = await vehiculosRef.add(docData);
      const vehicleId = newRef.id;

      const docUrlUpdates = {};
      await vehiculoAppendCreateDocUrl(docUrlUpdates, uidTrim, vehicleId, certificado_circulacion_frente_base64, "certificado_circulacion_frente_url", "certificado_circulacion_frente");
      await vehiculoAppendCreateDocUrl(docUrlUpdates, uidTrim, vehicleId, certificado_circulacion_reverso_base64, "certificado_circulacion_reverso_url", "certificado_circulacion_reverso");
      await vehiculoAppendCreateDocUrl(docUrlUpdates, uidTrim, vehicleId, rcv_documento_frente_base64, "rcv_documento_frente_url", "rcv_documento_frente");
      await vehiculoAppendCreateDocUrl(docUrlUpdates, uidTrim, vehicleId, rcv_documento_reverso_base64, "rcv_documento_reverso_url", "rcv_documento_reverso");
      await vehiculoAppendCreateDocUrl(docUrlUpdates, uidTrim, vehicleId, trimestres_frente_base64, "trimestres_frente_url", "trimestres_frente");
      await vehiculoAppendCreateDocUrl(docUrlUpdates, uidTrim, vehicleId, trimestres_reverso_base64, "trimestres_reverso_url", "trimestres_reverso");

      const pathUrl = await vehiculoUploadMainImage(uidTrim, vehicleId, imagen_base64);
      const patch = { ...docUrlUpdates };
      if (pathUrl) patch.path = pathUrl;
      if (Object.keys(patch).length) await newRef.update(patch);

      return res.status(201).json({
        message: "Vehículo creado.",
        uidvehicle: vehicleId,
        path: pathUrl || undefined,
        documentos: docUrlUpdates,
      });
    }

    const vehicleId = uidvehicle.trim();
    const vehicleRef = vehiculosRef.doc(vehicleId);
    const vehicleDoc = await vehicleRef.get();
    if (!vehicleDoc.exists) {
      return res.status(404).json({ error: "Vehículo no encontrado en este usuario." });
    }

    const existing = vehicleDoc.data() || {};

    docData.certificado_circulacion_frente_url = await vehiculoResolveUpdateDocUrl(
      uidTrim,
      vehicleId,
      certificado_circulacion_frente_base64,
      "certificado_circulacion_frente_url",
      "certificado_circulacion_frente",
      existing,
    );
    docData.certificado_circulacion_reverso_url = await vehiculoResolveUpdateDocUrl(
      uidTrim,
      vehicleId,
      certificado_circulacion_reverso_base64,
      "certificado_circulacion_reverso_url",
      "certificado_circulacion_reverso",
      existing,
    );
    docData.rcv_documento_frente_url = await vehiculoResolveUpdateDocUrl(
      uidTrim,
      vehicleId,
      rcv_documento_frente_base64,
      "rcv_documento_frente_url",
      "rcv_documento_frente",
      existing,
    );
    docData.rcv_documento_reverso_url = await vehiculoResolveUpdateDocUrl(
      uidTrim,
      vehicleId,
      rcv_documento_reverso_base64,
      "rcv_documento_reverso_url",
      "rcv_documento_reverso",
      existing,
    );
    docData.trimestres_frente_url = await vehiculoResolveUpdateDocUrl(
      uidTrim,
      vehicleId,
      trimestres_frente_base64,
      "trimestres_frente_url",
      "trimestres_frente",
      existing,
    );
    docData.trimestres_reverso_url = await vehiculoResolveUpdateDocUrl(
      uidTrim,
      vehicleId,
      trimestres_reverso_base64,
      "trimestres_reverso_url",
      "trimestres_reverso",
      existing,
    );

    let pathUrl = "";
    if (imagen_base64 && typeof imagen_base64 === "string" && imagen_base64.trim()) {
      await vehicleRef.update({ path: admin.firestore.FieldValue.delete() });
      pathUrl = await vehiculoUploadMainImage(uidTrim, vehicleId, imagen_base64);
      if (pathUrl) {
        docData.path = pathUrl;
      }
    }

    await vehicleRef.update(docData);
    return res.status(200).json({
      message: "Vehículo actualizado.",
      uidvehicle: vehicleId,
      path: pathUrl || undefined,
      documentos: {
        certificado_circulacion_frente_url: docData.certificado_circulacion_frente_url || undefined,
        certificado_circulacion_reverso_url: docData.certificado_circulacion_reverso_url || undefined,
        rcv_documento_frente_url: docData.rcv_documento_frente_url || undefined,
        rcv_documento_reverso_url: docData.rcv_documento_reverso_url || undefined,
        trimestres_frente_url: docData.trimestres_frente_url || undefined,
        trimestres_reverso_url: docData.trimestres_reverso_url || undefined,
      },
    });
  } catch (error) {
    console.error("Error al guardar/actualizar vehículo:", error);
    res.status(500).json({ error: `Error al guardar vehículo: ${error.message}` });
  }
};

const SaveClient = async (req, res) => {
  try {
    // Recibir los datos del cliente desde el cuerpo de la solicitud
    const { Nombre, cedula, phone, email, password, estado, base64, token } = req.body;

    // Validar el formato del teléfono (ejemplo: debe tener 10 dígitos)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .send("El teléfono debe contener 10 caracteres numéricos");
    }

    let userRecord;
    try {
      // Intentar obtener el usuario por email
      userRecord = await admin.auth().getUserByEmail(email);

      // Si existe, actualizar la clave y otros detalles
      userRecord = await admin.auth().updateUser(userRecord.uid, {
        email: email,
        password: password,
        phoneNumber: `+58${phone}`,
        displayName: Nombre,
        disabled: false,
      });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // Si no existe, crearlo
        userRecord = await admin.auth().createUser({
          email: email,
          password: password,
          phoneNumber: `+58${phone}`,
          displayName: Nombre,
          disabled: false,
        });
      } else {
        // Si otro error ocurre, lanzarlo
        throw error;
      }
    }

    // Obtener el UID del usuario
    const uid = userRecord.uid;

    // Subir la imagen de perfil al Storage
    let imageUrl = "";
    if (base64) {
      const buffer = Buffer.from(base64, "base64");
      const file = bucket.file(`profileImages/${uid}.jpg`);

      await file.save(buffer, {
        metadata: { contentType: "image/jpeg" },
        public: true,
        validation: "md5",
      });

      imageUrl = `https://storage.googleapis.com/${bucket.name}/profileImages/${uid}.jpg`;
    }

    // Crear o actualizar el documento en la colección "Usuarios"
    const infoUserCreated = {
      uid: uid,
      nombre: Nombre,
      cedula: cedula,
      phone: phone,
      typeUser: "Cliente",
      email: email,
      estado: estado,
      image_perfil: imageUrl, // Guardar la URL de la imagen de perfil
      token: token,
      createdAt: new Date(),
    };

    await db
      .collection("Usuarios")
      .doc(uid)
      .set(infoUserCreated, { merge: true });

    // Enviar correo de bienvenida
    const htmlContent = `
      <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenido a Solvers</title>
          </head>
          <body style="font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #eef5f9;">
            <table cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; margin: 20px auto; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0px 7px 30px 0px rgba(90, 114, 123, 0.11);">
              <!-- Header superior con borde azul -->
              <tr>
                <td style="height: 5px; background: linear-gradient(135deg, #5D87FF 0%, #4669d9 100%);"></td>
              </tr>

              <!-- Logo y título -->
              <tr>
                <td style="padding: 40px 30px; text-align: center; background-color: #ffffff;">
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                    <tr>
                      <td style="text-align: center;">
                        <img src="https://firebasestorage.googleapis.com/v0/b/talleres-solvers-app.firebasestorage.app/o/data%2Flogo%2Fsolverslogo.png?alt=media&token=c2937894-0be6-431b-a0df-4b5288fecfd5" 
                            alt="Solvers Logo" 
                            style="height: 40px; margin-bottom: 20px;">
                        <h1 style="margin: 0; font-size: 24px; color: #2B3445; font-weight: 600;">¡Bienvenido a <strong>Solvers</strong>! Nos alegra tenerte con nosotros.</h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Contenido principal -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                    <tr>
                      <td>
  <h2 style="margin: 0 0 20px; color: #2B3445; font-size: 18px; font-weight: 600;">Hola ${Nombre},</h2>
  
  <p style="margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;">
    Has sido registrado exitosamente en nuestra plataforma de servicios de mecánica. Desde ahora, podrás solicitar ayuda de profesionales para resolver cualquier inconveniente con tu vehículo, estés donde estés.
  </p>
  
  <p style="margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;">
    Tu cuenta está vinculada al correo:  
    <span style="color: #5D87FF; font-weight: 600;">${email}</span>
  </p>

  <p style="margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;">
    ¿Listo para empezar? Ingresa a la app y solicita tu primer servicio cuando lo necesites.
  </p>
</td>

                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f6f8; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 10px; color: #2B3445; font-size: 14px; font-weight: 600;">
                    Solvers, C.A.
                  </p>
                  <p style="margin: 0 0 5px; color: #6C757D; font-size: 12px;">
                    Este es un correo automático, por favor no respondas a este mensaje.
                  </p>
                  <p style="margin: 0; color: #6C757D; font-size: 12px;">
                    © ${new Date().getFullYear()} Solvers, C.A. Todos los derechos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </body>
          </html>
    `;

    try {
      await sendEmail(email, htmlContent, '¡Bienvenido a Solvers!');
    } catch (emailError) {
      console.error("Error al enviar el correo de bienvenida:", emailError);
      // No interrumpimos el flujo si falla el envío del correo
    }

    // Responder con el ID del documento creado o actualizado
    res.status(201).send({ message: "Usuario guardado con éxito", uid: uid });
  } catch (error) {
    console.error("Error al guardar el usuario:", error);

    // Manejar errores específicos de Firebase
    if (error.code === "auth/email-already-exists") {
      return res
        .status(400)
        .send({ message: "El correo electrónico ya está en uso" });
    } else if (error.code === "auth/invalid-email") {
      return res
        .status(400)
        .send({ message: "El correo electrónico proporcionado no es válido" });
    } else if (error.code === "auth/weak-password") {
      return res
        .status(400)
        .send({ message: "La contraseña es demasiado débil" });
    } else if (error.code === "auth/phone-number-already-exists") {
      return res
        .status(400)
        .send({ message: "El número telefónico ya existe" });
    }

    // En caso de un error inesperado
    res.status(500).send("Error al guardar el usuario");
  }
};

const SaveTaller = async (req, res) => {
  try {
    // Recibir los datos del taller desde el cuerpo de la solicitud
    const { Nombre, rif, phone, email, password, whats, metodos_pago, estado, base64, lat, lng, token } = req.body;

    let userRecord;
    try {
      // Intentar obtener el usuario por email
      userRecord = await admin.auth().getUserByEmail(email);

      // Si existe, actualizar la clave y otros detalles
      userRecord = await admin.auth().updateUser(userRecord.uid, {
        email: email,
        password: password,
        phoneNumber: `+58${phone}`,
        displayName: Nombre,
        disabled: false,
      });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // Si no existe, crearlo
        userRecord = await admin.auth().createUser({
          email: email,
          password: password,
          phoneNumber: `+58${phone}`,
          displayName: Nombre,
          disabled: false,
        });
      } else {
        // Si otro error ocurre, lanzarlo
        throw error;
      }
    }

    // Obtener el UID del usuario
    const uid = userRecord.uid;

    // Subir la imagen de perfil al Storage
    let imageUrl = "";
    if (base64) {
      const buffer = Buffer.from(base64, "base64");
      const file = bucket.file(`profileImages/${uid}.jpg`);

      await file.save(buffer, {
        metadata: { contentType: "image/jpeg" },
        public: true,
        validation: "md5",
      });

      imageUrl = `https://storage.googleapis.com/${bucket.name}/profileImages/${uid}.jpg`;
    }

    // Crear o actualizar el documento en la colección "Usuarios"
    const infoUserCreated = {
      uid: uid,
      nombre: Nombre,
      rif: rif,
      phone: phone,
      typeUser: "Taller",
      email: email,
      status: "Pendiente",
      whatsapp: whats,
      metodos_pago: metodos_pago,
      estado: estado,
      image_perfil: imageUrl, // Guardar la URL de la imagen de perfil
      ubicacion: {
        lat: lat,
        lng: lng
      },
      token: token
    };

    await db
      .collection("Usuarios")
      .doc(uid)
      .set(infoUserCreated, { merge: true });

    const htmlContent = `
      <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenido a Solvers</title>
          </head>
          <body style="font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #eef5f9;">
            <table cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; margin: 20px auto; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0px 7px 30px 0px rgba(90, 114, 123, 0.11);">
              <!-- Header superior con borde azul -->
              <tr>
                <td style="height: 5px; background: linear-gradient(135deg, #5D87FF 0%, #4669d9 100%);"></td>
              </tr>

              <!-- Logo y título -->
              <tr>
                <td style="padding: 40px 30px; text-align: center; background-color: #ffffff;">
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                    <tr>
                      <td style="text-align: center;">
                        <img src="https://firebasestorage.googleapis.com/v0/b/talleres-solvers-app.firebasestorage.app/o/data%2Flogo%2Fsolverslogo.png?alt=media&token=c2937894-0be6-431b-a0df-4b5288fecfd5" 
                            alt="Solvers Logo" 
                            style="height: 40px; margin-bottom: 20px;">
                        <h1 style="margin: 0; font-size: 24px; color: #2B3445; font-weight: 600;">¡Bienvenido a <strong>Solvers</strong>! Nos alegra tenerte con nosotros.</h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Contenido principal -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                    <tr>
                     <td>
  <h2 style="margin: 0 0 20px; color: #2B3445; font-size: 18px; font-weight: 600;">Hola ${Nombre},</h2>
  
  <p style="margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;">
    Tu taller ha sido registrado exitosamente en nuestra plataforma.
  </p>
  
  <p style="margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;">
    A partir de ahora podrás recibir solicitudes de clientes que necesitan asistencia con sus vehículos, gestionar tus servicios, y hacer crecer tu negocio con el respaldo de Solvers.
  </p>
  
  <p style="margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;">
    La cuenta del taller está asociada al correo:  
    <span style="color: #5D87FF; font-weight: 600;">${email}</span>
  </p>

  <p style="margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;">
    Te invitamos a explorar la app y configurar tus servicios para comenzar a recibir clientes.
  </p>
</td>


                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f6f8; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 10px; color: #2B3445; font-size: 14px; font-weight: 600;">
                    Solvers, C.A.
                  </p>
                  <p style="margin: 0 0 5px; color: #6C757D; font-size: 12px;">
                    Este es un correo automático, por favor no respondas a este mensaje.
                  </p>
                  <p style="margin: 0; color: #6C757D; font-size: 12px;">
                    © ${new Date().getFullYear()} Solvers, C.A. Todos los derechos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </body>
          </html>
    `;

    try {
      await sendEmail(email, htmlContent, '¡Bienvenido a Solvers!');
    } catch (emailError) {
      console.error("Error al enviar el correo de bienvenida:", emailError);
      // No interrumpimos el flujo si falla el envío del correo
    }

    // Responder con el ID del documento creado o actualizado
    res.status(201).send({ message: "Usuario guardado con éxito", uid: uid });
  } catch (error) {
    console.error("Error al guardar el usuario:", error);

    // Manejar errores específicos de Firebase
    if (error.code === "auth/email-already-exists") {
      return res
        .status(400)
        .send({ message: "Este email ya está registrado." });
    } else if (error.code === "auth/phone-number-already-exists") {
      return res
        .status(400)
        .send({ message: "Este número de teléfono ya está registrado." });
    } else if (error.code === "auth/invalid-phone-number") {
      return res
        .status(400)
        .send({ message: "El número de teléfono no es válido." });
    } else if (error.code === "auth/invalid-password") {
      return res.status(400).send({ message: "La contraseña es inválida." });
    }

    // En caso de un error inesperado
    res.status(500).send("Error al guardar el usuario");
  }
};

const SaveTallerExtended = async (req, res) => {
  try {
    // Recibir los datos del taller desde el cuerpo de la solicitud
    const {
      nombre,
      cedula,
      rif,
      phone,
      email,
      password,
      Direccion,
      RegComercial,
      Caracteristicas,
      Experiencia,
      LinkFacebook,
      LinkInstagram,
      LinkTiktok,
      seguro,
      checked,
      whatsapp,
      metodos_pago,
      estado,
      base64,
      rifIdFiscal,
      permisoOperacion,
      logotipoNegocio,
      fotoFrenteTaller,
      fotoInternaTaller,
      lat,
      lng,
      token,
      horarios_atencion
    } = req.body;

    let userRecord;
    try {
      // Intentar obtener el usuario por email
      userRecord = await admin.auth().getUserByEmail(email);

      // Si existe, actualizar la clave y otros detalles
      userRecord = await admin.auth().updateUser(userRecord.uid, {
        email: email,
        password: password,
        phoneNumber: `+58${phone}`,
        displayName: nombre,
        disabled: false,
      });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // Si no existe, crearlo
        userRecord = await admin.auth().createUser({
          email: email,
          password: password,
          phoneNumber: `+58${phone}`,
          displayName: nombre,
          disabled: false,
        });
      } else {
        // Si otro error ocurre, lanzarlo
        throw error;
      }
    }

    // Obtener el UID del usuario
    const uid = userRecord.uid;

    // Subir las imágenes al Storage
    let imageUrl = "";
    let rifIdFiscalUrl = "";
    let permisoOperacionUrl = "";
    let logotipoNegocioUrl = "";
    let fotoFrenteTallerUrl = "";
    let fotoInternaTallerUrl = "";

    // Subir imagen de perfil
    if (base64 && base64 !== "") {
      const buffer = Buffer.from(base64, "base64");
      const file = bucket.file(`profileImages/${uid}.jpg`);

      await file.save(buffer, {
        metadata: { contentType: "image/jpeg" },
        public: true,
        validation: "md5",
      });

      imageUrl = `https://storage.googleapis.com/${bucket.name}/profileImages/${uid}.jpg`;
    }

    // Subir RIF ID Fiscal
    if (rifIdFiscal && rifIdFiscal !== "") {
      const buffer = Buffer.from(rifIdFiscal, "base64");
      const file = bucket.file(`documents/${uid}/rifIdFiscal.jpg`);

      await file.save(buffer, {
        metadata: { contentType: "image/jpeg" },
        public: true,
        validation: "md5",
      });

      rifIdFiscalUrl = `https://storage.googleapis.com/${bucket.name}/documents/${uid}/rifIdFiscal.jpg`;
    }

    // Subir Permiso de Operación
    if (permisoOperacion && permisoOperacion !== "") {
      const buffer = Buffer.from(permisoOperacion, "base64");
      const file = bucket.file(`documents/${uid}/permisoOperacion.jpg`);

      await file.save(buffer, {
        metadata: { contentType: "image/jpeg" },
        public: true,
        validation: "md5",
      });

      permisoOperacionUrl = `https://storage.googleapis.com/${bucket.name}/documents/${uid}/permisoOperacion.jpg`;
    }

    // Subir Logotipo del Negocio
    if (logotipoNegocio && logotipoNegocio !== "") {
      const buffer = Buffer.from(logotipoNegocio, "base64");
      const file = bucket.file(`businessImages/${uid}/logotipoNegocio.jpg`);

      await file.save(buffer, {
        metadata: { contentType: "image/jpeg" },
        public: true,
        validation: "md5",
      });

      logotipoNegocioUrl = `https://storage.googleapis.com/${bucket.name}/businessImages/${uid}/logotipoNegocio.jpg`;
    }

    // Subir Foto Frente del Taller
    if (fotoFrenteTaller && fotoFrenteTaller !== "") {
      const buffer = Buffer.from(fotoFrenteTaller, "base64");
      const file = bucket.file(`businessImages/${uid}/fotoFrenteTaller.jpg`);

      await file.save(buffer, {
        metadata: { contentType: "image/jpeg" },
        public: true,
        validation: "md5",
      });

      fotoFrenteTallerUrl = `https://storage.googleapis.com/${bucket.name}/businessImages/${uid}/fotoFrenteTaller.jpg`;
    }

    // Subir Foto Interna del Taller
    if (fotoInternaTaller && fotoInternaTaller !== "") {
      const buffer = Buffer.from(fotoInternaTaller, "base64");
      const file = bucket.file(`businessImages/${uid}/fotoInternaTaller.jpg`);

      await file.save(buffer, {
        metadata: { contentType: "image/jpeg" },
        public: true,
        validation: "md5",
      });

      fotoInternaTallerUrl = `https://storage.googleapis.com/${bucket.name}/businessImages/${uid}/fotoInternaTaller.jpg`;
    }

    // Crear o actualizar el documento en la colección "Usuarios" con campos extendidos
    const infoUserCreated = {
      uid: uid,
      nombre: nombre == undefined ? '' : nombre,
      rif: rif == undefined ? '' : rif,
      phone: phone == undefined ? '' : phone?.replace(/\s+/g, ""),
      typeUser: 'Taller',
      email: email == undefined ? '' : email.toLowerCase(),
      password: password,
      status: 'En espera por aprobación',
      Direccion: Direccion == undefined ? '' : Direccion,
      RegComercial: RegComercial == undefined ? '' : RegComercial,
      Caracteristicas: Caracteristicas == undefined ? '' : Caracteristicas,
      Experiencia: Experiencia == undefined ? '' : Experiencia,
      LinkFacebook: LinkFacebook == undefined ? '' : LinkFacebook,
      LinkInstagram: LinkInstagram == undefined ? '' : LinkInstagram,
      LinkTiktok: LinkTiktok == undefined ? '' : LinkTiktok,
      seguro: seguro == undefined ? '' : seguro,
      agenteAutorizado: checked == undefined ? false : checked,
      whatsapp: whatsapp == undefined ? '' : whatsapp,
      metodos_pago: metodos_pago == undefined ? [] : metodos_pago,
      estado: estado == undefined ? '' : estado,
      image_perfil: imageUrl, // Guardar la URL de la imagen de perfil
      rifIdFiscal: rifIdFiscalUrl, // URL del RIF ID Fiscal
      permisoOperacion: permisoOperacionUrl, // URL del Permiso de Operación
      logotipoNegocio: logotipoNegocioUrl, // URL del Logotipo del Negocio
      fotoFrenteTaller: fotoFrenteTallerUrl, // URL de la Foto Frente del Taller
      fotoInternaTaller: fotoInternaTallerUrl, // URL de la Foto Interna del Taller
      ubicacion: {
        lat: lat == undefined ? '' : lat,
        lng: lng == undefined ? '' : lng
      },
      token: token,
      createdAt: new Date(),
      horarios_atencion: horarios_atencion == undefined ? [] : horarios_atencion
    };

    await db
      .collection("Usuarios")
      .doc(uid)
      .set(infoUserCreated, { merge: true });

    const htmlContent = `
      <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenido a Solvers</title>
          </head>
          <body style="font-family: 'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #eef5f9;">
            <table cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; margin: 20px auto; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0px 7px 30px 0px rgba(90, 114, 123, 0.11);">
              <!-- Header superior con borde azul -->
              <tr>
                <td style="height: 5px; background: linear-gradient(135deg, #5D87FF 0%, #4669d9 100%);"></td>
              </tr>

              <!-- Logo y título -->
              <tr>
                <td style="padding: 40px 30px; text-align: center; background-color: #ffffff;">
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                    <tr>
                      <td style="text-align: center;">
                        <img src="https://firebasestorage.googleapis.com/v0/b/talleres-solvers-app.firebasestorage.app/o/data%2Flogo%2Fsolverslogo.png?alt=media&token=c2937894-0be6-431b-a0df-4b5288fecfd5" 
                            alt="Solvers Logo" 
                            style="height: 40px; margin-bottom: 20px;">
                        <h1 style="margin: 0; font-size: 24px; color: #2B3445; font-weight: 600;">¡Bienvenido a <strong>Solvers</strong>! Nos alegra tenerte con nosotros.</h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Contenido principal -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                    <tr>
                     <td>
  <h2 style="margin: 0 0 20px; color: #2B3445; font-size: 18px; font-weight: 600;">Hola ${nombre},</h2>
  
  <p style="margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;">
    Tu taller ha sido registrado exitosamente en nuestra plataforma con información extendida.
  </p>
  
  <p style="margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;">
    A partir de ahora podrás recibir solicitudes de clientes que necesitan asistencia con sus vehículos, gestionar tus servicios, y hacer crecer tu negocio con el respaldo de Solvers.
  </p>
  
  <p style="margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;">
    La cuenta del taller está asociada al correo:  
    <span style="color: #5D87FF; font-weight: 600;">${email}</span>
  </p>

  <p style="margin: 0 0 20px; color: #2B3445; font-size: 15px; line-height: 1.6;">
    Tu solicitud está en proceso de revisión. Te notificaremos una vez que sea aprobada.
  </p>
</td>


                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f6f8; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0 0 10px; color: #2B3445; font-size: 14px; font-weight: 600;">
                    Solvers, C.A.
                  </p>
                  <p style="margin: 0 0 5px; color: #6C757D; font-size: 12px;">
                    Este es un correo automático, por favor no respondas a este mensaje.
                  </p>
                  <p style="margin: 0; color: #6C757D; font-size: 12px;">
                    © ${new Date().getFullYear()} Solvers, C.A. Todos los derechos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </body>
          </html>
    `;

    try {
      await sendEmail(email, htmlContent, '¡Bienvenido a Solvers!');
    } catch (emailError) {
      console.error("Error al enviar el correo de bienvenida:", emailError);
      // No interrumpimos el flujo si falla el envío del correo
    }

    // Responder con el ID del documento creado o actualizado
    res.status(201).send({ message: "Usuario guardado con éxito", uid: uid });
  } catch (error) {
    console.error("Error al guardar el usuario:", error);

    // Manejar errores específicos de Firebase
    if (error.code === "auth/email-already-exists") {
      return res
        .status(400)
        .send({ message: "Este email ya está registrado." });
    } else if (error.code === "auth/phone-number-already-exists") {
      return res
        .status(400)
        .send({ message: "Este número de teléfono ya está registrado." });
    } else if (error.code === "auth/invalid-phone-number") {
      return res
        .status(400)
        .send({ message: "El número de teléfono no es válido." });
    } else if (error.code === "auth/invalid-password") {
      return res.status(400).send({ message: "La contraseña es inválida." });
    }

    // En caso de un error inesperado
    res.status(500).send("Error al guardar el usuario");
  }
};

// Función para autenticar usuarios
const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se proporcione el email y la contraseña
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email y contraseña son requeridos" });
    }

    // Autenticar al usuario con Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Verificar si el usuario está autenticado
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // Buscar en la colección "Usuarios" por email
    const result = await db
      .collection("Usuarios")
      .where("email", "==", email)
      .get();

    if (result.empty) {
      // Si no se encuentra en "Usuarios", buscar en "Admins"
      const resultAdmin = await db
        .collection("Admins")
        .where("email", "==", email)
        .get();

      if (resultAdmin.empty) {
        // Si tampoco se encuentra en "Admins", devolver un error 404
        return res.status(404).send({
          message: "Usuario no encontrado ni en Usuarios ni en Admins",
        });
      } else {
        // Si se encuentra en "Admins", devolver los datos del usuario y el UID del documento
        const adminData = resultAdmin.docs.map((doc) => ({
          uid: doc.id, // Incluir el UID del documento
          ...doc.data(),
        }));
        return res.status(200).send({
          message: "Usuario autenticado exitosamente como Admin",
          userData: adminData[0], // Enviar el primer documento encontrado con el UID
        });
      }
    } else {
      // Si se encuentra en "Usuarios", devolver los datos del usuario y el UID del documento
      const userData = result.docs.map((doc) => ({
        uid: doc.id, // Incluir el UID del documento
        ...doc.data(),
      }));
      return res.status(200).send({
        message: "Usuario autenticado exitosamente",
        userData: userData[0], // Enviar el primer documento encontrado con el UID
      });
    }
  } catch (error) {
    // Manejo de errores
    console.error("Error al autenticar al usuario:", error);
    if (error.code === "auth/user-not-found") {
      return res.status(404).send({
        message: "Usuario no encontrado en Firebase Authentication",
      });
    } else if (error.code === "auth/wrong-password") {
      return res.status(401).send({
        message: "Contraseña incorrecta",
      });
    } else {
      return res.status(500).send({
        message: "Error al autenticar al usuario",
        error: error.message, // Incluir detalles para depuración
      });
    }
  }
};

const getUserByUid = async (req, res) => {
  try {
    // Obtener el UID desde los parámetros de la URL
    const { uid } = req.body;

    console.log(uid);

    // Buscar el documento del usuario con el UID en la colección "Usuarios"
    const userDoc = await db.collection("Usuarios").doc(uid).get();

    // Verificar si el documento existe
    if (userDoc.exists) {
      console.log("Existe");
      console.log(userDoc);
      console.log("***********************************************");
      console.log(userDoc.data());
      // Si el documento existe, devolver los datos del usuario
      return res.status(200).send({
        message: "Usuario encontrado",
        userData: userDoc.data(), // Devuelve los datos del documento
      });
    } else {
      console.log("No Existe");
      // Si el documento no existe, devolver un mensaje de error
      return res.status(404).send({
        message: "No se encontró el usuario con el UID proporcionado",
      });
    }
  } catch (error) {
    console.error("Error al obtener el usuario por UID:", error);
    console.log("Dio errro");
    res.status(500).send("Error al obtener el usuario");
  }
};


const SaveTallerAll = (req, res) => {
  try {
    const { uid, base64, imageTodelete } = req.body;

    // Verificar que el UID no esté vacío
    if (!uid) {
      return res.status(400).send({ message: "El UID es obligatorio." });
    }

    const getLastImageIndex = () => {
      return new Promise((resolve, reject) => {
        const prefix = `profileImages/${uid}`;
        bucket.getFiles({ prefix })
          .then(([files]) => {
            let maxIndex = 0;
            files.forEach(file => {
              const match = file.name.match(/(\d+)\.jpg$/);
              if (match) {
                const index = parseInt(match[1], 10);
                if (index > maxIndex) {
                  maxIndex = index;
                }
              }
            });
            resolve(maxIndex);
          })
          .catch(error => {
            reject(error);
          });
      });
    };

    const processImage = (index) => {
      return new Promise((resolve, reject) => {
        if (base64 && base64.trim() !== '') {
          const newFileName = `profileImages/${uid}_${index + 1}.jpg`;
          const buffer = Buffer.from(base64, 'base64');
          const file = bucket.file(newFileName);

          // Subir la nueva imagen
          file.save(buffer, {
            metadata: { contentType: 'image/jpeg' },
            public: true,
            validation: 'md5'
          })
            .then(() => {
              const imageUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`;
              req.body.image_perfil = imageUrl;
              resolve();
            })
            .catch(error => {
              console.error("Error al guardar la nueva imagen:", error);
              reject(error);
            });
        } else {
          resolve();
        }
      });
    };

    const clearOldImageField = () => {
      return new Promise((resolve, reject) => {
        if (base64 && base64.trim() !== '' && imageTodelete && imageTodelete.trim() !== '') {
          db.collection("Usuarios").doc(uid).update({ image_perfil: admin.firestore.FieldValue.delete() })
            .then(() => resolve())
            .catch(error => reject(error));
        } else {
          resolve();
        }
      });
    };

    const deleteOldImage = () => {
      return new Promise((resolve, reject) => {
        if (base64 && base64.trim() !== '' && imageTodelete && imageTodelete.trim() !== '') {
          const file = bucket.file(`profileImages/${imageTodelete}`);
          file.delete()
            .then(() => resolve())
            .catch(error => {
              if (error.code === 404) {
                resolve(); // Resolver incluso si no se encuentra la imagen a eliminar
              } else {
                console.error("Error al eliminar la imagen anterior:", error);
                reject(error);
              }
            });
        } else {
          resolve();
        }
      });
    };

    // Secuencia de ejecución de promesas
    getLastImageIndex()
      .then(index => {
        if (base64 && base64.trim() !== '') {
          return clearOldImageField()
            .then(() => deleteOldImage())
            .then(() => processImage(index));
        } else {
          return processImage(index);
        }
      })
      .then(() => {
        delete req.body.base64;
        delete req.body.imageTodelete;
        return db.collection("Usuarios").doc(uid).set(req.body, { merge: true });
      })
      .then(() => {
        // Responder con el ID del documento creado y un mensaje de éxito
        res.status(201).send({ message: "Usuario actualizado con éxito", uid: uid });
      })
      .catch(error => {
        console.error("Error al guardar el usuario:", error);

        // Manejar errores específicos
        if (error.code === "permission-denied") {
          res.status(403).send({ message: "Permisos insuficientes para guardar el usuario." });
        } else if (error.code === "not-found") {
          res.status(404).send({ message: "Usuario no encontrado." });
        } else {
          // Error general
          res.status(500).send({ message: "Error al guardar el usuario", error: error.message });
        }
      });
  } catch (error) {
    console.error("Error al guardar el usuario:", error);

    // Manejar errores específicos
    if (error.code === "permission-denied") {
      return res.status(403).send({ message: "Permisos insuficientes para guardar el usuario." });
    } else if (error.code === "not-found") {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    // Error general
    res.status(500).send({ message: "Error al guardar el usuario", error: error.message });
  }
};

const TALLER_DOC_FIELD_PATHS = {
  rifIdFiscal: (uid, ext) => `documents/${uid}/rifIdFiscal.${ext}`,
  permisoOperacion: (uid, ext) => `documents/${uid}/permisoOperacion.${ext}`,
  logotipoNegocio: (uid, ext) => `businessImages/${uid}/logotipoNegocio.${ext}`,
  fotoFrenteTaller: (uid, ext) => `businessImages/${uid}/fotoFrenteTaller.${ext}`,
  fotoInternaTaller: (uid, ext) => `businessImages/${uid}/fotoInternaTaller.${ext}`,
};

const isWebOrGsUrl = (s) => {
  const t = String(s).trim();
  return /^https?:\/\//i.test(t) || /^gs:\/\//i.test(t);
};

const parseDataUrlBase64 = (s) => {
  const t = String(s).trim();
  const m = t.match(/^data:([^;]+);base64,(.+)$/is);
  if (!m) return null;
  return { contentType: m[1].trim(), base64: m[2].replace(/\s/g, "") };
};

const looksLikeRawBase64 = (s) => {
  const t = String(s).trim();
  if (!t || isWebOrGsUrl(t) || /^data:/i.test(t)) return false;
  if (t.length < 80) return false;
  const clean = t.replace(/\s/g, "");
  return /^[A-Za-z0-9+/]+=*$/.test(clean);
};

const extAndContentType = (mime) => {
  const m = String(mime || "").toLowerCase();
  if (m.includes("png")) return { ext: "png", contentType: "image/png" };
  if (m.includes("webp")) return { ext: "webp", contentType: "image/webp" };
  if (m.includes("gif")) return { ext: "gif", contentType: "image/gif" };
  return { ext: "jpg", contentType: "image/jpeg" };
};

const uploadBufferToPath = (path, buffer, contentType) => {
  const file = bucket.file(path);
  return file.save(buffer, {
    metadata: { contentType },
    public: true,
    validation: "md5",
  });
};

/**
 * URL o gs:// se dejan igual; data:...;base64,... o base64 largo → Storage → URL;
 * texto corto (p. ej. RIF) se guarda tal cual.
 */
const resolveTallerDocumentacionField = async (uid, fieldName, value) => {
  const raw = value ?? "";
  const trimmed =
    typeof raw === "string" ? raw.trim() : String(raw).trim();
  if (trimmed === "") return "";

  if (isWebOrGsUrl(trimmed)) return trimmed;

  const dataUrl = parseDataUrlBase64(trimmed);
  let buffer;
  let mimeHint = "image/jpeg";
  if (dataUrl) {
    buffer = Buffer.from(dataUrl.base64, "base64");
    mimeHint = dataUrl.contentType || "image/jpeg";
  } else if (looksLikeRawBase64(trimmed)) {
    buffer = Buffer.from(trimmed.replace(/\s/g, ""), "base64");
  } else {
    return trimmed;
  }

  const pathFn = TALLER_DOC_FIELD_PATHS[fieldName];
  if (!pathFn) return trimmed;

  const { ext, contentType } = extAndContentType(mimeHint);
  const storagePath = pathFn(uid, ext);
  await uploadBufferToPath(storagePath, buffer, contentType);
  return `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
};

const UpdateTallerUsuarioDocs = async (req, res) => {
  try {
    const payload = { ...(req.body || {}) };
    const { uid, base64, imageTodelete } = payload;

    if (!uid) {
      return res.status(400).send({ message: "El UID es obligatorio." });
    }

    // Misma lógica que SaveTallerAll para foto de perfil (base64 / imageTodelete), sobre `payload`.
    const getLastImageIndex = () =>
      new Promise((resolve, reject) => {
        const prefix = `profileImages/${uid}`;
        bucket
          .getFiles({ prefix })
          .then(([files]) => {
            let maxIndex = 0;
            files.forEach((file) => {
              const match = file.name.match(/(\d+)\.jpg$/);
              if (match) {
                const index = parseInt(match[1], 10);
                if (index > maxIndex) maxIndex = index;
              }
            });
            resolve(maxIndex);
          })
          .catch(reject);
      });

    const processImage = (index) =>
      new Promise((resolve, reject) => {
        if (base64 && base64.trim() !== "") {
          const newFileName = `profileImages/${uid}_${index + 1}.jpg`;
          const buffer = Buffer.from(base64, "base64");
          const file = bucket.file(newFileName);
          file
            .save(buffer, {
              metadata: { contentType: "image/jpeg" },
              public: true,
              validation: "md5",
            })
            .then(() => {
              payload.image_perfil = `https://storage.googleapis.com/${bucket.name}/${newFileName}`;
              resolve();
            })
            .catch((error) => {
              console.error("Error al guardar la nueva imagen:", error);
              reject(error);
            });
        } else {
          resolve();
        }
      });

    const clearOldImageField = () =>
      new Promise((resolve, reject) => {
        if (
          base64 &&
          base64.trim() !== "" &&
          imageTodelete &&
          imageTodelete.trim() !== ""
        ) {
          db.collection("Usuarios")
            .doc(uid)
            .update({ image_perfil: admin.firestore.FieldValue.delete() })
            .then(() => resolve())
            .catch(reject);
        } else {
          resolve();
        }
      });

    const deleteOldImage = () =>
      new Promise((resolve, reject) => {
        if (
          base64 &&
          base64.trim() !== "" &&
          imageTodelete &&
          imageTodelete.trim() !== ""
        ) {
          const file = bucket.file(`profileImages/${imageTodelete}`);
          file
            .delete()
            .then(() => resolve())
            .catch((error) => {
              if (error.code === 404) {
                resolve();
              } else {
                console.error("Error al eliminar la imagen anterior:", error);
                reject(error);
              }
            });
        } else {
          resolve();
        }
      });

    const index = await getLastImageIndex();
    if (base64 && base64.trim() !== "") {
      await clearOldImageField();
      await deleteOldImage();
    }
    await processImage(index);

    const keys = [
      "rifIdFiscal",
      "permisoOperacion",
      "logotipoNegocio",
      "fotoFrenteTaller",
      "fotoInternaTaller",
    ];

    const resolved = await Promise.all(
      keys.map((k) =>
        resolveTallerDocumentacionField(uid, k, payload[k] ?? "").then((v) => [
          k,
          v,
        ])
      )
    );

    resolved.forEach(([k, v]) => {
      payload[k] = v;
    });

    delete payload.base64;
    delete payload.imageTodelete;

    Object.keys(payload).forEach((k) => {
      if (payload[k] === undefined) delete payload[k];
    });

    await db.collection("Usuarios").doc(uid).set(payload, { merge: true });

    return res
      .status(201)
      .send({ message: "Usuario actualizado con éxito", uid });
  } catch (error) {
    console.error("Error al actualizar documentación del taller:", error);

    if (error.code === "permission-denied") {
      return res
        .status(403)
        .send({ message: "Permisos insuficientes para guardar el usuario." });
    }
    if (error.code === "not-found") {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    return res.status(500).send({
      message: "Error al guardar el usuario",
      error: error.message,
    });
  }
};

const restorePass = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "El campo email es obligatorio" });
  }

  try {
    // Genera link de restablecimiento de contraseña
    const link = await admin.auth().generatePasswordResetLink(email);

    if (!link || typeof link !== 'string') {
      throw new Error("No se pudo generar el link de restablecimiento");
    }

    // HTML con enlace seguro
    const htmlContent = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background-color: #1e3a8a; padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Restablecer Contraseña</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e40af; margin: 0 0 20px 0; font-size: 24px; font-weight: 500;">Hola,</h2>
          <p style="color: #000000; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
          </p>
          <p style="color: #000000; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
            Usa el siguiente enlace para cambiar tu contraseña:
          </p>
          <div style="background-color: #dbeafe; border: 2px solid #3b82f6; border-radius: 6px; padding: 20px; margin: 30px 0; text-align: center;">
            <p style="color: #1d4ed8; text-decoration: underline; font-weight: 600; font-size: 16px; word-break: break-all; line-height: 1.4;">
              ${String(link)}
            </p>
          </div>
          <p style="color: #3730a3; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0; text-align: center;">
            Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura.
          </p>
        </div>
        <div style="background-color: #eff6ff; padding: 20px 30px; text-align: center; border-top: 1px solid #bfdbfe;">
          <p style="color: #3730a3; font-size: 12px; margin: 0; line-height: 1.4;">
            Este enlace expirará en 24 horas por motivos de seguridad.
          </p>
        </div>
      </div>
    `;

    // Enviar email
    await sendEmail(email, htmlContent, 'Restablecer contraseña');

    res.status(200).json({ message: "Si el correo existe, se enviará un enlace para restablecer la contraseña" });

  } catch (error) {
    console.error("❌ Error generando link:", error);
    res.status(500).json({ message: "Hubo un error al procesar la solicitud" });
  }
};



const getTalleres = async (req, res) => {
  try {

    const { estado } = req.body;

    // Hacer la consulta base sin el filtro de estado
    const query = await db
      .collection("Usuarios")
      .where("status", "!=", "Aprobado")
      .where("typeUser", "==", "Taller");

    const result = await query.get();

    if (result.empty) {
      return res
        .status(404)
        .send('No se encontraron usuarios con el tipo "Taller"');
    }

    let usuarios = result.docs.map((doc) => doc.data());

    // Filtrar en memoria según el estado
    if (Array.isArray(estado)) {
      if (estado.length === 0) {
        return res.status(400).send("El array de estados está vacío.");
      }
      // Filtrar los usuarios cuyo estado esté en el array
      usuarios = usuarios.filter(usuario => estado.includes(usuario.estado));
    } else if (typeof estado === "string") {
      // Filtrar los usuarios con ese estado específico
      usuarios = usuarios.filter(usuario => usuario.estado === estado);
    } else if (estado !== undefined) {
      return res.status(400).send("El parámetro 'estado' debe ser un string o un array de strings.");
    }

    res.send(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).send("Error al obtener usuarios");
  }
};

const actualizarStatusUsuario = async (req, res) => {
  try {
    // Obtener el UID y el nuevo estado desde el cuerpo de la solicitud
    const { uid, nuevoStatus, certificador_nombre, certificador_key } = req.body;

    // Verificar que se haya proporcionado un UID y un nuevo estado
    if (!uid || !nuevoStatus) {
      return res.status(400).send({
        message: "El UID y el nuevo estado son requeridos",
      });
    }

    // Actualizar el campo 'status' en el documento del usuario
    await db.collection("Usuarios").doc(uid).update({
      status: nuevoStatus,
      certificador_nombre,
      certificador_key
    });

    // Devolver una respuesta de éxito
    return res.status(200).send({
      message: "El estado del usuario ha sido actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar el estado del usuario:", error);
    return res.status(500).send({
      message: "Error al actualizar el estado del usuario",
      error: error.message, // Incluir detalles para depuración
    });
  }
};

const UpdateTaller = async (req, res) => {
  try {
    // Recibir los datos del cliente desde el cuerpo de la solicitud
    const {
      uid,
      nombre,
      rif,
      phone,
      email,
      Direccion,
      RegComercial,
      Caracteristicas,
      Tarifa,
      Experiencia,
      LinkFacebook,
      LinkInstagram,
      LinkTiktok,
      Garantia,
      seguro,
      agenteAutorizado,
    } = req.body;

    // Crear el objeto con los datos que se actualizarán en la colección "Usuarios"
    const updatedUserInfo = {
      uid: uid,
      nombre: nombre == undefined ? "" : nombre,
      rif: rif == undefined ? "" : rif,
      phone: phone == undefined ? "" : phone,
      typeUser: "Taller",
      email: email == undefined ? "" : email,
      Direccion: Direccion == undefined ? "" : Direccion,
      RegComercial: RegComercial == undefined ? "" : RegComercial,
      Caracteristicas: Caracteristicas == undefined ? "" : Caracteristicas,
      Tarifa: Tarifa == undefined ? "" : Tarifa,
      Experiencia: Experiencia == undefined ? "" : Experiencia,
      LinkFacebook: LinkFacebook == undefined ? "" : LinkFacebook,
      LinkInstagram: LinkInstagram == undefined ? "" : LinkInstagram,
      LinkTiktok: LinkTiktok == undefined ? "" : LinkTiktok,
      Garantia: Garantia == undefined ? "" : Garantia,
      seguro: seguro == undefined ? "" : seguro,
      agenteAutorizado:
        agenteAutorizado == undefined ? false : agenteAutorizado,
    };

    // Actualizar el documento en la colección "Usuarios" con el UID proporcionado
    await db.collection("Usuarios").doc(uid).update(updatedUserInfo);

    // Responder con un mensaje de éxito
    res
      .status(200)
      .send({ message: "Usuario actualizado con éxito", uid: uid });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);

    // En caso de error, responder con el mensaje correspondiente
    res
      .status(500)
      .send({
        message: "Error al actualizar el usuario",
        error: error.message,
      });
  }
};

const UpdateClient = async (req, res) => {
  try {
    // Recibir los datos del cliente desde el cuerpo de la solicitud
    const { uid, Nombre, cedula, phone, email, base64, imageTodelete, estado } = req.body;

    // Crear el objeto que se actualizará en la colección "Usuarios"
    const updatedUserInfo = {
      nombre: Nombre,
      cedula: cedula,
      phone: phone,
      typeUser: "Cliente",
      email: email,
      uid: uid,
      estado: estado,
    };

    const getLastImageIndex = () => {
      return new Promise((resolve, reject) => {
        const prefix = `profileImages/${uid}`;
        bucket.getFiles({ prefix })
          .then(([files]) => {
            let maxIndex = 0;
            files.forEach(file => {
              const match = file.name.match(/(\d+)\.jpg$/);
              if (match) {
                const index = parseInt(match[1], 10);
                if (index > maxIndex) {
                  maxIndex = index;
                }
              }
            });
            resolve(maxIndex);
          })
          .catch(error => {
            reject(error);
          });
      });
    };

    const processImage = (index) => {
      return new Promise((resolve, reject) => {
        if (base64 && base64.trim() !== '') {
          const newFileName = `profileImages/${uid}_${index + 1}.jpg`;
          const buffer = Buffer.from(base64, 'base64');
          const file = bucket.file(newFileName);

          // Subir la nueva imagen
          file.save(buffer, {
            metadata: { contentType: 'image/jpeg' },
            public: true,
            validation: 'md5'
          })
            .then(() => {
              const imageUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`;
              updatedUserInfo.image_perfil = imageUrl;
              resolve();
            })
            .catch(error => {
              console.error("Error al guardar la nueva imagen:", error);
              reject(error);
            });
        } else {
          resolve();
        }
      });
    };

    const deleteOldImage = () => {
      return new Promise((resolve, reject) => {
        if (imageTodelete && imageTodelete.trim() !== '') {
          const file = bucket.file(`profileImages/${imageTodelete}`);
          file.delete()
            .then(() => resolve())
            .catch(error => {
              if (error.code === 404) {
                resolve(); // Resolver incluso si no se encuentra la imagen a eliminar
              } else {
                console.error("Error al eliminar la imagen anterior:", error);
                reject(error);
              }
            });
        } else {
          resolve();
        }
      });
    };

    getLastImageIndex()
      .then((index) => processImage(index))
      .then(() => {
        // Eliminar el campo base64 y imageTodelete del cuerpo de la solicitud
        delete req.body.base64;
        delete req.body.imageTodelete;
      })
      .then(() => db.collection("Usuarios").doc(uid).update(updatedUserInfo))
      .then(() => {
        if (imageTodelete && imageTodelete.trim() !== '') {
          return deleteOldImage();
        }
      })
      .then(() => {
        // Responder con un mensaje de éxito
        res.status(200).send({ message: "Usuario actualizado con éxito", uid: uid });
      })
      .catch(error => {
        console.error("Error al actualizar el usuario:", error);

        // Manejar posibles errores en la actualización del documento
        res.status(500).send("Error al actualizar el usuario");
      });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);

    // Manejar posibles errores en la actualización del documento
    res.status(500).send("Error al actualizar el usuario");
  }
};



const getServicesByTalleruid = async (req, res) => {
  try {
    // Obtener el UID_TALLER desde el cuerpo de la solicitud
    const { uid_taller } = req.body;

    console.log(uid_taller);

    // Buscar en la colección "Servicios" los documentos donde uid_taller coincide
    const servicesSnapshot = await db
      .collection("Servicios")
      .where("uid_taller", "==", uid_taller)
      .get();

    // Verificar si existen documentos con el uid_taller proporcionado
    if (servicesSnapshot.empty) {
      console.log(
        "No se encontraron servicios para el UID_TALLER proporcionado"
      );
      return res.status(404).send({
        message: "No se encontraron servicios para el UID_TALLER proporcionado",
      });
    }

    // Mapear los datos de los documentos encontrados en un array
    const services = servicesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Enviar los servicios encontrados
    return res.status(200).send({
      message: "Servicios encontrados",
      services,
    });
  } catch (error) {
    console.error("Error al obtener los servicios por UID_TALLER:", error);
    res.status(500).send("Error al obtener los servicios");
  }
};

const getServiceByUid = async (req, res) => {
  try {
    // Obtener el UID del servicio desde el cuerpo de la solicitud
    const { uid } = req.body;

    console.log("UID del servicio:", uid);

    // Buscar el documento en la colección "Servicios" donde el campo "uid" coincide
    const serviceSnapshot = await db
      .collection("Servicios")
      .doc(uid)
      .get();

    // Verificar si el documento existe
    if (!serviceSnapshot.exists) {
      console.log("No se encontró el servicio con el UID proporcionado");
      return res.status(404).send({
        message: "No se encontró el servicio con el UID proporcionado",
      });
    }

    // Obtener los datos del documento encontrado
    const serviceData = {
      id: serviceSnapshot.id,
      ...serviceSnapshot.data(),
    };

    // Enviar el servicio encontrado
    return res.status(200).send({
      message: "Servicio encontrado",
      service: serviceData,
    });
  } catch (error) {
    console.error("Error al obtener el servicio por UID:", error);
    res.status(500).send("Error al obtener el servicio");
  }
};

const getServicesByTallerUidTrue = async (req, res) => {
  try {
    // Obtener el UID del taller desde el cuerpo de la solicitud
    const { uid } = req.body || {};

    console.log("UID del taller:", uid);

    if (!uid || typeof uid !== "string" || uid.trim() === "") {
      return res.status(400).send({
        message: "El campo uid es requerido.",
      });
    }

    console.log("UID del servicio:", uid);

    // Buscar los servicios del taller
    const serviceSnapshot = await db
      .collection("Servicios")
      .where("uid_taller", "==", uid.trim())
      .where("estatus", "==", true)
      .get();

    // Verificar si hay servicios
    if (serviceSnapshot.empty) {
      console.log("No se encontraron servicios para el UID proporcionado");
      return res.status(404).send({
        message: "No se encontraron servicios para el UID proporcionado",
      });
    }

    // Obtener los datos de los documentos encontrados
    const services = serviceSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Enviar los servicios encontrados
    return res.status(200).send({
      message: "Servicios encontrados",
      services,
    });
  } catch (error) {
    console.error("Error al obtener el servicio por UID:", error);
    res.status(500).send("Error al obtener el servicio");
  }
};

const getActiveCategories = async (req, res) => {
  try {
    // Consultar la colección "Categorias" donde el campo "estatus" es true
    const categoriesSnapshot = await db
      .collection("Categorias")
      .where("estatus", "==", true)
      .get();

    // Verificar si existen documentos con estatus true
    if (categoriesSnapshot.empty) {
      console.log("No se encontraron categorías activas");
      return res.status(404).send({
        message: "No se encontraron categorías activas",
      });
    }

    // Mapear los datos de los documentos encontrados en un array
    const categories = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Enviar las categorías activas encontradas
    return res.status(200).send({
      message: "Categorías activas encontradas",
      categories,
    });
  } catch (error) {
    console.error("Error al obtener las categorías activas:", error);
    res.status(500).send("Error al obtener las categorías activas");
  }
};

const getSubcategoriesByCategoryUid = async (req, res) => {
  try {
    // Obtener el UID de la categoría desde el cuerpo de la solicitud
    const { uid_categoria } = req.body;

    console.log(`UID de la categoría: ${uid_categoria}`);

    // Referencia a la subcolección "Subcategoría" dentro del documento de la categoría especificada
    const subcategoriesSnapshot = await db
      .collection("Categorias")
      .doc(uid_categoria)
      .collection("Subcategorias")
      .where("estatus", "==", true) // Filtro para obtener solo subcategorías activas
      .get();

    // Verificar si existen documentos en la subcolección
    if (subcategoriesSnapshot.empty) {
      console.log("No se encontraron subcategorías para la categoría proporcionada");
      return res.status(404).send({
        message: "No se encontraron subcategorías para la categoría proporcionada",
      });
    }

    // Mapear los datos de los documentos encontrados en un array
    const subcategories = subcategoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Enviar las subcategorías encontradas
    return res.status(200).send({
      message: "Subcategorías encontradas",
      subcategories,
    });
  } catch (error) {
    console.error("Error al obtener las subcategorías por UID de categoría:", error);
    res.status(500).send("Error al obtener las subcategorías");
  }
};




// const saveOrUpdateService = async (req, res) => {
//   try {
//     // Obtener los datos del servicio desde el cuerpo de la solicitud
//     const {
//       id,
//       categoria,
//       descripcion,
//       estatus,
//       garantia,
//       nombre_servicio,
//       precio,
//       subcategoria,
//       taller,
//       uid_categoria,
//       uid_servicio,
//       uid_subcategoria,
//       uid_taller,
//       puntuacion,
//       publicOrigin,
//       base64,
//       imageTodelete
//     } = req.body;

//     console.log("Datos del servicio:", req.body);

//     const serviceData = {
//       categoria,
//       descripcion,
//       estatus,
//       garantia,
//       nombre_servicio,
//       precio,
//       subcategoria,
//       taller,
//       uid_categoria,
//       uid_servicio,
//       uid_subcategoria,
//       uid_taller,
//       puntuacion
//     };

//     const getLastImageIndex = (id) => {
//       return new Promise((resolve, reject) => {
//         const prefix = `service_images/${id}`;
//         bucket.getFiles({ prefix })
//           .then(([files]) => {
//             let maxIndex = 0;
//             files.forEach(file => {
//               const match = file.name.match(/_(\d+)\.jpg$/);
//               if (match) {
//                 const index = parseInt(match[1], 10);
//                 if (index > maxIndex) {
//                   maxIndex = index;
//                 }
//               }
//             });
//             resolve(maxIndex);
//           })
//           .catch(error => {
//             reject(error);
//           });
//       });
//     };

//     const processImage = async (id) => {
//       let imageUrl = '';
//       if (base64 && base64.trim() !== '') {
//         const index = await getLastImageIndex(id);
//         const newFileName = `service_images/${id}_${index + 1}.jpg`;
//         const buffer = Buffer.from(base64, 'base64');
//         const file = bucket.file(newFileName);

//         await file.save(buffer, {
//           metadata: { contentType: 'image/jpeg' },
//           public: true,
//           validation: 'md5'
//         });

//         imageUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`;
//         serviceData.image = imageUrl;
//       }
//       return imageUrl;
//     };

//     const deleteOldImage = () => {
//       return new Promise((resolve, reject) => {
//         if (base64 && base64.trim() !== '' && imageTodelete && imageTodelete.trim() !== '') {
//           const file = bucket.file(`service_images/${imageTodelete}`);
//           file.delete()
//             .then(() => resolve())
//             .catch(error => {
//               if (error.code === 404) {
//                 resolve(); // Resolver incluso si no se encuentra la imagen a eliminar
//               } else {
//                 console.error("Error al eliminar la imagen anterior:", error);
//                 reject(error);
//               }
//             });
//         } else {
//           resolve();
//         }
//       });
//     };

//     // Si `id` tiene un valor, editar el documento en la colección "Servicios"
//     if (id) {
//       const serviceRef = db.collection("Servicios").doc(id);
//       const serviceSnapshot = await serviceRef.get();

//       if (!serviceSnapshot.exists) {
//         return res.status(404).send({
//           message: "No se encontró el servicio con el ID proporcionado para actualizar",
//         });
//       }

//       await serviceRef.update(serviceData);
//       console.log("Servicio actualizado:", id);

//       if (serviceData.estatus) {
//         if (!publicOrigin) {
//           const userId = uid_taller;
//           const userRef = db.collection("Usuarios").doc(userId);
//           const userDoc = await userRef.get();

//           if (userDoc.exists) {
//             const userData = userDoc.data();
//             let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
//             cantidadServicios -= 1;

//             await userRef.update({
//               "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(),
//             });
//           }
//         }

//         const imageUrl = await processImage(id);
//         await deleteOldImage();

//         if (base64 && base64.trim() !== '') {
//           // Actualizar el campo service_image en el documento del servicio solo si el base64 no está vacío ni es nulo
//           await serviceRef.update({ service_image: imageUrl });
//         }

//         return res.status(200).send({
//           message: "Servicio actualizado exitosamente",
//           service: { id, ...serviceData },
//         });
//       } else {
//         if (publicOrigin) {
//           const userId = uid_taller;
//           const userRef = db.collection("Usuarios").doc(userId);
//           const userDoc = await userRef.get();

//           if (userDoc.exists) {
//             const userData = userDoc.data();
//             let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
//             cantidadServicios += 1;

//             await userRef.update({
//               "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(),
//             });
//           }
//         }

//         const imageUrl = await processImage(id);
//         await deleteOldImage();

//         if (base64 && base64.trim() !== '') {
//           // Actualizar el campo service_image en el documento del servicio solo si el base64 no está vacío ni es nulo
//           await serviceRef.update({ service_image: imageUrl });
//         }

//         return res.status(200).send({
//           message: "Servicio actualizado exitosamente",
//           service: { id, ...serviceData },
//         });
//       }
//     } else {
//       const newServiceRef = await db.collection("Servicios").add(serviceData);
//       console.log("Servicio creado con ID:", newServiceRef.id);

//       if (serviceData.estatus) {
//         if (!publicOrigin) {
//           const userId = uid_taller;
//           const userRef = db.collection("Usuarios").doc(userId);
//           const userDoc = await userRef.get();

//           if (userDoc.exists) {
//             const userData = userDoc.data();
//             let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
//             cantidadServicios -= 1;

//             await userRef.update({
//               "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(),
//             });
//           }
//         }

//         serviceData.id = newServiceRef.id;
//         const imageUrl = await processImage(newServiceRef.id);
//         await deleteOldImage();

//         if (base64 && base64.trim() !== '') {
//           // Actualizar el campo service_image en el documento del servicio solo si el base64 no está vacío ni es nulo
//           await newServiceRef.update({ service_image: imageUrl });
//         }

//         return res.status(201).send({
//           message: "Servicio creado exitosamente",
//           service: { id: newServiceRef.id, ...serviceData },
//         });
//       } else {
//         if (publicOrigin) {
//           const userId = uid_taller;
//           const userRef = db.collection("Usuarios").doc(userId);
//           const userDoc = await userRef.get();

//           if (userDoc.exists) {
//             const userData = userDoc.data();
//             let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
//             cantidadServicios += 1;

//             await userRef.update({
//               "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(),
//             });
//           }
//         }

//         serviceData.id = newServiceRef.id;
//         const imageUrl = await processImage(newServiceRef.id);
//         await deleteOldImage();

//         if (base64 && base64.trim() !== '') {
//           // Actualizar el campo service_image en el documento del servicio solo si el base64 no está vacío ni es nulo
//           await newServiceRef.update({ service_image: imageUrl });
//         }

//         return res.status(201).send({
//           message: "Servicio creado exitosamente",
//           service: { id: newServiceRef.id, ...serviceData },
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error al guardar o actualizar el servicio:", error);
//     res.status(500).send(error);
//   }
// };


const saveOrUpdateService = async (req, res) => {
  try {
    // Obtener los datos del servicio desde el cuerpo de la solicitud
    const {
      id,
      categoria,
      descripcion,
      estatus,
      garantia,
      nombre_servicio,
      precio,
      subcategoria,
      taller,
      uid_categoria,
      uid_servicio,
      uid_subcategoria,
      uid_taller,
      puntuacion,
      publicOrigin,
      images,
      edit
    } = req.body;
    console.log("Datos del servicio:", req.body);


    const serviceData = {
      categoria,
      descripcion,
      estatus,
      garantia,
      nombre_servicio,
      precio,
      subcategoria,
      taller,
      uid_categoria,
      uid_servicio,
      uid_subcategoria,
      uid_taller,
      puntuacion
    };

    console.log(serviceData)

    const getLastImageIndex = (id) => {
      return new Promise((resolve, reject) => {
        const prefix = `service_images/${id}`;
        bucket.getFiles({ prefix })
          .then(([files]) => {
            let maxIndex = 0;
            files.forEach(file => {
              const match = file.name.match(/_(\d+)\.jpg$/);
              if (match) {
                const index = parseInt(match[1], 10);
                if (index > maxIndex) {
                  maxIndex = index;
                }
              }
            });
            resolve(maxIndex);
          })
          .catch(error => {
            reject(error);
          });
      });
    };

    const uploadImages = async (id, images) => {
      const imageUrls = [];
      for (let i = 0; i < images?.length; i++) {
        const base64 = images[i];
        const index = await getLastImageIndex(id);
        const newFileName = `service_images/${id}_${index + 1}.jpg`;
        const buffer = Buffer.from(base64, 'base64');
        const file = bucket.file(newFileName);

        await file.save(buffer, {
          metadata: { contentType: 'image/jpeg' },
          public: true,
          validation: 'md5'
        });

        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`;
        imageUrls.push(imageUrl);
      }
      return imageUrls;
    };

    const deleteOldImages = async (id) => {
      const prefix = `service_images/${id}`;
      const [files] = await bucket.getFiles({ prefix });

      for (const file of files) {
        await file.delete();
      }
    };

    // Si `id` tiene un valor, editar el documento en la colección "Servicios"
    if (id) {
      const serviceRef = db.collection("Servicios").doc(id);
      const serviceSnapshot = await serviceRef.get();

      if (!serviceSnapshot.exists) {
        return res.status(404).send({
          message: "No se encontró el servicio con el ID proporcionado para actualizar",
        });
      }

      await serviceRef.update(serviceData);
      console.log("Servicio actualizado:", id);

      if (serviceData.estatus) {
        if (!publicOrigin) {
          const userId = uid_taller;
          const userRef = db.collection("Usuarios").doc(userId);
          const userDoc = await userRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
            cantidadServicios -= 1;

            await userRef.update({
              "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(),
            });
          }
        }

        if (edit) {
          await deleteOldImages(id);
        }

        const imageUrls = await uploadImages(id, images);
        serviceData.service_image = imageUrls;

        await serviceRef.update(serviceData);



        return res.status(200).send({
          message: "Servicio actualizado exitosamente",
          service: { id, ...serviceData },
        });
      } else {
        if (publicOrigin) {
          const userId = uid_taller;
          const userRef = db.collection("Usuarios").doc(userId);
          const userDoc = await userRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
            cantidadServicios += 1;

            await userRef.update({
              "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(),
            });
          }
        }

        if (edit) {
          await deleteOldImages(id);
        }

        const imageUrls = await uploadImages(id, images);
        serviceData.service_image = imageUrls;

        await serviceRef.update(serviceData);

        return res.status(200).send({
          message: "Servicio actualizado exitosamente",
          service: { id, ...serviceData },
        });
      }
    } else {
      const newServiceRef = await db.collection("Servicios").add(serviceData);
      console.log("Servicio creado con ID:", newServiceRef.id);

      if (serviceData.estatus) {
        if (!publicOrigin) {
          const userId = uid_taller;
          const userRef = db.collection("Usuarios").doc(userId);
          const userDoc = await userRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
            cantidadServicios -= 1;

            await userRef.update({
              "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(),
            });
          }
        }

        serviceData.id = newServiceRef.id;
        const imageUrls = await uploadImages(newServiceRef.id, images);
        serviceData.service_image = imageUrls;

        await newServiceRef.update(serviceData);

        return res.status(201).send({
          message: "Servicio creado exitosamente",
          service: { id: newServiceRef.id, ...serviceData },
        });
      } else {
        if (publicOrigin) {
          const userId = uid_taller;
          const userRef = db.collection("Usuarios").doc(userId);
          const userDoc = await userRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0;
            cantidadServicios += 1;

            await userRef.update({
              "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(),
            });
          }
        }

        serviceData.id = newServiceRef.id;

        const imageUrls = await uploadImages(newServiceRef.id, images);
        serviceData.service_image = imageUrls;

        await newServiceRef.update(serviceData);

        return res.status(201).send({
          message: "Servicio creado exitosamente",
          service: { id: newServiceRef.id, ...serviceData },
        });
      }
    }
  } catch (error) {
    console.error("Error al guardar o actualizar el servicio:", error);
    res.status(500).send(error);
  }
};

const getPlanes = async (req, res) => {
  try {
    const result = await db
      .collection("Planes")
      .where("status", "==", "Activo") // Filtrar documentos por status "Activo"
      .get();

    if (result.empty) {
      return res
        .status(404)
        .send('No se encontraron planes con el estado "Activo"');
    }

    const planes = result.docs.map((doc) => doc.data());

    res.send(planes);
  } catch (error) {
    console.error("Error al obtener planes:", error);
    res.status(500).send("Error al obtener planes");
  }
};

const getMetodosPago = async (req, res) => {
  try {
    const result = await db
      .collection("MetodosPago")
      .where("status", "==", true) // Filtrar documentos por status "Activo"
      .get();

    if (result.empty) {
      return res
        .status(404)
        .send('No se encontraron los metodos con el estado "true"');
    }

    const planes = result.docs.map((doc) => doc.data());

    res.send(planes);
  } catch (error) {
    console.error("Error al obtener metodos:", error);
    res.status(500).send("Error al obtener metodos");
  }
};

// Función para guardar la suscripción
const uploadImage = (file, buffer) => {
  return new Promise((resolve, reject) => {
    file.save(buffer, {
      metadata: { contentType: 'image/jpeg' },
      public: true,
      validation: 'md5',
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/** Convierte un escalar de coordenada (número, string "10,5", etc.) a número finito o NaN. */
const parseCoordScalar = (v) => {
  if (v == null || v === "") return NaN;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const t = v.trim().replace(/\s/g, "").replace(",", ".");
    const n = Number(t);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
};

const getLatLngFromUbicacion = (ubicacion) => {
  if (!ubicacion || typeof ubicacion !== "object") return { lat: NaN, lng: NaN };
  if (ubicacion instanceof GeoPoint) {
    return { lat: ubicacion.latitude, lng: ubicacion.longitude };
  }
  if (
    typeof ubicacion.latitude === "number" &&
    typeof ubicacion.longitude === "number" &&
    Number.isFinite(ubicacion.latitude) &&
    Number.isFinite(ubicacion.longitude)
  ) {
    return { lat: ubicacion.latitude, lng: ubicacion.longitude };
  }
  const lat = ubicacion.lat ?? ubicacion.latitude;
  const lng = ubicacion.lng ?? ubicacion.longitude;
  return {
    lat: parseCoordScalar(lat),
    lng: parseCoordScalar(lng),
  };
};

/** Coordenadas del taller: `ubicacion` / `location` GeoPoint o { lat, lng }; respaldo `lat`/`lng` en raíz. */
const getLatLngTallerSimple = (t) => {
  if (!t || typeof t !== "object") return { lat: NaN, lng: NaN };
  let u = getLatLngFromUbicacion(t.ubicacion);
  if (!Number.isFinite(u.lat) || !Number.isFinite(u.lng)) {
    u = getLatLngFromUbicacion(t.location);
  }
  if (Number.isFinite(u.lat) && Number.isFinite(u.lng)) {
    return u;
  }
  return {
    lat: parseCoordScalar(t.lat),
    lng: parseCoordScalar(t.lng),
  };
};

const fetchServiciosByCategoriaId = async (categoriaId) => {
  return db
    .collection("Servicios")
    .where("uid_categoria", "==", categoriaId)
    .get();
};

const getUniqueUidTalleres = (serviciosSnapshot) => {
  const uidTalleres = new Set();
  serviciosSnapshot.docs.forEach((doc) => {
    const data = doc.data() || {};
    const uidTaller = data.uid_taller;
    if (uidTaller && typeof uidTaller === "string" && uidTaller.trim() !== "") {
      uidTalleres.add(uidTaller.trim());
    }
  });
  return Array.from(uidTalleres);
};

const fetchUsuariosByUids = async (uids) => {
  const IN_LIMIT = 10; // Firestore 'in' limit
  const talleres = [];

  const uidsList = Array.isArray(uids) ? uids : [];
  for (let i = 0; i < uidsList.length; i += IN_LIMIT) {
    const chunk = uidsList.slice(i, i + IN_LIMIT);
    const snapshot = await db
      .collection("Usuarios")
      .where(admin.firestore.FieldPath.documentId(), "in", chunk)
      .where("typeUser", "==", "Taller")
      .where("status", "==", "Aprobado")
      .get();

    snapshot.docs.forEach((d) => {
      talleres.push({
        uid_taller: d.id,
        ...d.data(),
      });
    });
  }

  return talleres;
};

/** Distancia Haversine (km) entre la solicitud y cada taller; añade `kmDistance`; deja ≤ radiusKm y top `limit`. */
const filterTalleresCercanos = (talleres, userLat, userLng, radiusKm = 10, limit = 10) => {
  if (!Array.isArray(talleres)) {
    return [];
  }

  const uLat = parseCoordScalar(userLat);
  const uLng = parseCoordScalar(userLng);
  if (!Number.isFinite(uLat) || !Number.isFinite(uLng)) {
    return [];
  }

  const withKm = talleres
    .map((t) => {
      const { lat, lng } = getLatLngTallerSimple(t);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null;
      }
      const kmDistance = getDistanceKm(uLat, uLng, lat, lng);
      if (!Number.isFinite(kmDistance)) {
        return null;
      }
      return { ...t, kmDistance };
    })
    .filter(Boolean);

  withKm.sort((a, b) => a.kmDistance - b.kmDistance);

  return withKm
    .filter((t) => t.kmDistance <= radiusKm && t.kmDistance >= 0)
    .slice(0, limit);
};

const saveSolicitud = async (req, res) => {
  try {
    const {
      nombreSolicitud,
      vehiculo,
      categoriaId,
      descripcion,
      urgencia,
      fotos,
      nombre_usuario,
      uid_usuario,
      phone_usuario,
      latitude,
      longitude,
      uid_taller,

    } = req.body || {};

    if (!nombreSolicitud || !vehiculo || !vehiculo.id || !categoriaId) {
      return res.status(400).json({
        error:
          "nombreSolicitud, vehiculo (con id) y categoriaId son requeridos.",
      });
    }


    const solicitudData = {
      nombre_solicitud: nombreSolicitud,
      status: "En espera por aprobación",
      vehiculo,
      categoriaId,
      descripcion: descripcion || "",
      urgencia: urgencia || "",
      nombre_usuario: nombre_usuario || "",
      uid_usuario: uid_usuario || "",
      phone_usuario: phone_usuario || "",
      latitude: latitude ?? "",
      longitude: longitude ?? "",
      solicitud_images: [],
      fecha_solicitud: admin.firestore.Timestamp.now(),
      uid_taller: uid_taller || "",
    };

    const solicitudRef = await db.collection("Solicitudes").add(solicitudData);
    const solicitudId = solicitudRef.id;

    const userLat = parseCoordScalar(latitude);
    const userLng = parseCoordScalar(longitude);

    const idTallerDirigido =
      uid_taller != null && String(uid_taller).trim() !== ""
        ? String(uid_taller).trim()
        : null;

    const RADIO_KM_NOTIFICACION = 10;
    let talleresCercanos;
    let talleresParaNotificar;

    if (idTallerDirigido) {
      const tallerSnap = await db.collection("Usuarios").doc(idTallerDirigido).get();
      let tallerUnico = null;
      if (tallerSnap.exists) {
        const d = tallerSnap.data() || {};
        if (d.typeUser === "Taller" && d.status === "Aprobado") {
          tallerUnico = { uid_taller: tallerSnap.id, ...d };
        }
      }
      talleresCercanos = tallerUnico ? [tallerUnico] : [];
      talleresParaNotificar = talleresCercanos;
    } else {
      const serviciosSnapshot = await fetchServiciosByCategoriaId(categoriaId);
      const uidTalleresUnicos = getUniqueUidTalleres(serviciosSnapshot);
      const talleres = await fetchUsuariosByUids(uidTalleresUnicos);
      talleresCercanos = filterTalleresCercanos(
        talleres,
        userLat,
        userLng,
        RADIO_KM_NOTIFICACION,
        10
      );
      talleresParaNotificar = talleresCercanos.filter(
        (t) =>
          Number.isFinite(t.kmDistance) && t.kmDistance <= RADIO_KM_NOTIFICACION
      );
    }

    const talleresConToken = talleresParaNotificar.filter(
      (t) => t.token && typeof t.token === "string" && t.token.trim() !== ""
    );
    await Promise.allSettled(
      talleresConToken.map((taller) => {
        const reqNotif = {
          body: {
            token: taller.token,
            title: "Nueva solicitud cerca de tu ubicacion",
            body: "¡Hay una nueva solicitud cerca de tu ubicación! Revísala y envía tu cotización para atenderla.",
            secretCode: "NuevaSolicitud",
          },
        };
        const resNotif = {
          status: () => ({
            send: () => { },
          }),
        };
        return sendNotification(reqNotif, resNotif);
      })
    );

    const imageUrls = [];
    if (Array.isArray(fotos) && fotos.length > 0) {
      for (let i = 0; i < fotos.length; i++) {
        const base64 = fotos[i];
        if (!base64 || typeof base64 !== "string" || !base64.trim()) {
          continue;
        }

        const path = `Solicitudes/${solicitudId}/${i + 1}.jpg`;
        const buffer = Buffer.from(base64, "base64");
        const file = bucket.file(path);

        await uploadImage(file, buffer);
        const url = `https://storage.googleapis.com/${bucket.name}/${path}`;
        imageUrls.push(url);
      }
    }

    if (imageUrls.length > 0) {
      await solicitudRef.update({ solicitud_images: imageUrls });
    }

    return res.status(201).json({
      message: "Solicitud creada correctamente.",
      id: solicitudId,
      solicitud_images: imageUrls,
      talleres: talleresCercanos,
    });
  } catch (error) {
    console.error("Error al guardar solicitud:", error);
    return res.status(500).json({
      error: `Error al guardar solicitud: ${error.message}`,
    });
  }
};

const getSolicitudesByUsuario = async (req, res) => {
  try {
    const { uid_usuario, solo_ultima, status } = req.body || {};

    if (!uid_usuario || typeof uid_usuario !== "string" || uid_usuario.trim() === "") {
      return res
        .status(400)
        .json({ error: "uid_usuario es requerido." });
    }

    const snapshot = await db
      .collection("Solicitudes")
      .where("uid_usuario", "==", uid_usuario.trim())
      .where("status", "==", status.trim())
      .get();

    if (snapshot.empty) {
      return res.status(200).json(solo_ultima ? null : []);
    }

    let solicitudes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Si el flag viene en true, devolver solo la solicitud más nueva (por fecha_solicitud)
    if (solo_ultima) {
      solicitudes.sort((a, b) => {
        const fa = a.fecha_solicitud?.toMillis
          ? a.fecha_solicitud.toMillis()
          : 0;
        const fb = b.fecha_solicitud?.toMillis
          ? b.fecha_solicitud.toMillis()
          : 0;
        return fb - fa; // más reciente primero
      });

      return res.status(200).json(solicitudes[0] || null);
    }

    return res.status(200).json(solicitudes);
  } catch (error) {
    console.error("Error al obtener solicitudes por usuario:", error);
    return res
      .status(500)
      .json({ error: `Error al obtener solicitudes: ${error.message}` });
  }
};

/**
 * Solo solicitudes con el `status` pedido que no tengan ninguna fila en `Propuestas`
 * (coincidencia por `uid_solicitud` = id del documento en Solicitudes). Respuesta: array únicamente.
 */
const getSolicitudesByUsuarioAndStatus = async (req, res) => {
  try {
    const { status, uid_taller } = req.body || {};

    if (!status || typeof status !== "string" || status.trim() === "") {
      return res
        .status(400)
        .json({ error: "status es requerido." });
    }

    const snapshot = await db
      .collection("Solicitudes")
      .where("status", "==", status.trim())
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const solicitudIds = snapshot.docs.map((d) => String(d.id).trim());

    const idsConPropuesta = new Set();
    const IN_LIMIT = 10;
    for (let i = 0; i < solicitudIds.length; i += IN_LIMIT) {
      const chunk = solicitudIds.slice(i, i + IN_LIMIT).map((id) => String(id).trim());
      const propSnap = await db
        .collection("Propuestas")
        .where("uid_solicitud", "in", chunk)
        .get();
      propSnap.docs.forEach((doc) => {
        const raw = (doc.data() || {}).uid_solicitud;
        const uidSol = raw == null ? "" : String(raw).trim();
        if (uidSol !== "") {
          idsConPropuesta.add(uidSol);
        }
      });
    }

    let solicitudes = snapshot.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      .filter((s) => !idsConPropuesta.has(String(s.id).trim()));


    if (uid_taller !== undefined && uid_taller !== null && uid_taller !== "") {
      const uidTallerTrim = String(uid_taller).trim();
      solicitudes = solicitudes.filter((s) => {
        const st = s.uid_taller;
        const vacio = st == null || String(st).trim() === "";
        if (vacio) return true;
        return String(st).trim() === uidTallerTrim;
      });
    }

    return res.status(200).json(solicitudes);
  } catch (error) {
    console.error("Error al obtener solicitudes por status:", error);
    return res
      .status(500)
      .json({ error: `Error al obtener solicitudes: ${error.message}` });
  }
};

const getSolicitudByServicioUid = async (req, res) => {
  try {
    const { uid_servicio } = req.body || {};

    if (!uid_servicio || typeof uid_servicio !== "string" || uid_servicio.trim() === "") {
      return res
        .status(400)
        .json({ error: "uid_servicio es requerido." });
    }

    const docRef = db.collection("Solicitudes").doc(uid_servicio.trim());
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(200).json(null);
    }

    const solicitud = {
      id: docSnap.id,
      ...docSnap.data(),
    };

    return res.status(200).json(solicitud);
  } catch (error) {
    console.error("Error al obtener solicitud por uid_servicio:", error);
    return res
      .status(500)
      .json({ error: `Error al obtener solicitud por uid_servicio: ${error.message}` });
  }
};

const getPropuestasBySolicitud = async (req, res) => {
  try {
    const { uid_solicitud } = req.body || {};

    if (!uid_solicitud || typeof uid_solicitud !== "string" || uid_solicitud.trim() === "") {
      return res
        .status(400)
        .json({ error: "uid_solicitud es requerido." });
    }

    const propuestasSnapshot = await db
      .collection("Propuestas")
      .where("uid_solicitud", "==", uid_solicitud.trim())
      .get();

    if (propuestasSnapshot.empty) {
      return res.status(200).json([]);
    }

    const propuestas = propuestasSnapshot.docs.map((doc) => {
      const data = doc.data();
      const { id: _idDoc, ...rest } = data;
      return { id: doc.id, ...rest };
    });

    return res.status(200).json(propuestas);
  } catch (error) {
    console.error("Error al obtener propuestas por solicitud:", error);
    return res
      .status(500)
      .json({ error: `Error al obtener propuestas: ${error.message}` });
  }
};

const getUsuarioTokenBySolicitudUid = async (uid_solicitud) => {
  if (!uid_solicitud || typeof uid_solicitud !== "string" || !uid_solicitud.trim()) {
    return null;
  }

  const solicitudSnap = await db.collection("Solicitudes").doc(uid_solicitud.trim()).get();
  if (!solicitudSnap.exists) return null;

  const solicitudData = solicitudSnap.data() || {};
  const uidUsuario = solicitudData.uid_usuario;
  if (!uidUsuario || typeof uidUsuario !== "string" || !uidUsuario.trim()) return null;

  const usuarioSnap = await db.collection("Usuarios").doc(uidUsuario.trim()).get();
  if (!usuarioSnap.exists) return null;

  const usuarioData = usuarioSnap.data() || {};
  const token = usuarioData.token;
  if (!token || typeof token !== "string" || !token.trim()) return null;

  return token.trim();
};

const getUsuarioTokenByUid = async (uid) => {
  if (!uid || typeof uid !== "string" || !uid.trim()) return null;

  const usuarioSnap = await db.collection("Usuarios").doc(uid.trim()).get();
  if (!usuarioSnap.exists) return null;

  const usuarioData = usuarioSnap.data() || {};
  const token = usuarioData.token;
  if (!token || typeof token !== "string" || !token.trim()) return null;

  return token.trim();
};

const getNotificationPayloadForPropuestaStatus = (statusValue) => {
  const normalized = String(statusValue || "").trim().toLowerCase();
  if (normalized === "cotizado") {
    return {
      title: "Tienes una nueva cotizacion",
      body: "Un taller ya respondio tu solicitud. Entra para revisar la cotizacion y elegir la opcion que mas te convenga.",
    };
  }
  if (normalized === "inspeccion") {
    return {
      title: "Te solicitaron una inspeccion",
      body: "El taller quiere inspeccionar tu vehiculo antes de cotizar. Revisa la solicitud y aceptala si estas de acuerdo.",
    };
  }
  return null;
};

const notifyUsuarioByPropuestaStatus = async (uid_solicitud, statusValue, propuestaId) => {
  const notification = getNotificationPayloadForPropuestaStatus(statusValue);
  if (!notification) return;

  const token = await getUsuarioTokenBySolicitudUid(uid_solicitud);
  if (!token) return;

  const reqNotif = {
    body: {
      token,
      title: notification.title,
      body: notification.body,
      secretCode: "NuevaPropuesta",
    },
  };
  const resNotif = {
    status: () => ({
      send: () => { },
    }),
  };

  await sendNotification(reqNotif, resNotif);
};

const notifyTallerPropuestaAceptada = async (uid_taller) => {
  const token = await getUsuarioTokenByUid(uid_taller);
  if (!token) return;

  const reqNotif = {
    body: {
      token,
      title: "Tu propuesta fue aceptada",
      body: "Excelente noticia. El usuario acepto tu propuesta y pronto se pondra en contacto contigo.",
      secretCode: "PropuestaAceptada",
    },
  };
  const resNotif = {
    status: () => ({
      send: () => { },
    }),
  };

  await sendNotification(reqNotif, resNotif);
};

const savePropuesta = async (req, res) => {
  try {
    const body = req.body || {};

     body.fecha_propuesta = admin.firestore.Timestamp.now();

    const docRef = await db.collection("Propuestas").add(body);
    await docRef.update({ id: docRef.id });

    // Notificar usuario de la solicitud solo para status Cotizado o Inspeccion
    await notifyUsuarioByPropuestaStatus(body.uid_solicitud, body.status, docRef.id);

    return res.status(201).json({
      message: "Propuesta creada correctamente.",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error al guardar propuesta:", error);
    return res
      .status(500)
      .json({ error: `Error al guardar propuesta: ${error.message}` });
  }
};

const updateSolicitudStatus = async (req, res) => {
  try {
    const body = req.body || {};
    const { uid_solicitud, status } = body;

    if (!uid_solicitud || typeof uid_solicitud !== "string" || uid_solicitud.trim() === "") {
      return res.status(400).json({ error: "uid_solicitud es requerido." });
    }
    if (!status || typeof status !== "string" || status.trim() === "") {
      return res.status(400).json({ error: "status es requerido." });
    }

    const solicitudRef = db.collection("Solicitudes").doc(uid_solicitud.trim());
    const solicitudSnap = await solicitudRef.get();

    if (!solicitudSnap.exists) {
      return res.status(404).json({ error: "Solicitud no encontrada." });
    }

    await solicitudRef.update({ status: status.trim() });

    // Luego de actualizar la solicitud, rechazar todas las propuestas asociadas
    const propuestasSnapshot = await db
      .collection("Propuestas")
      .where("uid_solicitud", "==", uid_solicitud.trim())
      .get();

    if (!propuestasSnapshot.empty) {
      const batch = db.batch();
      propuestasSnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, {
          status: "Rechazada",
          fecha_rechazada: admin.firestore.Timestamp.now(),
        });
      });
      await batch.commit();
    }
    

    return res.status(200).json({
      message: "Status de la solicitud actualizado correctamente.",
      id: uid_solicitud.trim(),
      status: status.trim(),
    });
  } catch (error) {
    console.error("Error al actualizar status de la solicitud:", error);
    return res
      .status(500)
      .json({ error: `Error al actualizar solicitud: ${error.message}` });
  }
};

const updatePropuesta = async (req, res) => {
  try {
    const body = req.body || {};
    const { uid_propuesta, status } = body;

    if (!uid_propuesta || typeof uid_propuesta !== "string" || uid_propuesta.trim() === "") {
      return res.status(400).json({ error: "uid_propuesta es requerido." });
    }
    if (!status || typeof status !== "string" || status.trim() === "") {
      return res.status(400).json({ error: "status es requerido." });
    }

    const propuestaRef = db.collection("Propuestas").doc(uid_propuesta.trim());
    const propuestaSnap = await propuestaRef.get();

    if (!propuestaSnap.exists) {
      return res.status(404).json({ error: "Propuesta no encontrada." });
    }

    const propuestaData = propuestaSnap.data();
    const statusLower = status.trim().toLowerCase();

    const updatePropuestaData = {
      status: statusLower === "aceptada" ? "Aceptada" : "Rechazada",
    };
    if (statusLower === "aceptada") {
      updatePropuestaData.fecha_aceptada = admin.firestore.Timestamp.now();
    } else if (statusLower === "rechazada") {
      updatePropuestaData.fecha_rechazada = admin.firestore.Timestamp.now();
    }
    await propuestaRef.update(updatePropuestaData);

    if (statusLower === "aceptada") {
      const uid_solicitud = propuestaData.uid_solicitud;
      const uid_taller = propuestaData.uid_taller;

      if (!uid_solicitud || typeof uid_solicitud !== "string" || !uid_solicitud.trim()) {
        return res.status(400).json({
          error: "La propuesta no tiene uid_solicitud; no se puede actualizar la solicitud.",
        });
      }

      const solicitudRef = db.collection("Solicitudes").doc(uid_solicitud.trim());
      const solicitudSnap = await solicitudRef.get();
      if (!solicitudSnap.exists) {
        return res.status(404).json({ error: "Solicitud no encontrada." });
      }

      const solicitudUpdate = {};

      const statusAnterior = propuestaData.status && String(propuestaData.status).trim().toLowerCase();
      if (statusAnterior === "cotizado") {
        solicitudUpdate.nombre_taller = propuestaData.nombre_taller ?? "";
        solicitudUpdate.uid_taller = propuestaData.uid_taller ?? "";
        solicitudUpdate.comentario = propuestaData.comentario ?? "";
        solicitudUpdate.fecha_propuesta = propuestaData.fecha_propuesta ?? "";
        solicitudUpdate.precio_estimado = propuestaData.precio_estimado ?? "";
        solicitudUpdate.tiempo_estimado = propuestaData.tiempo_estimado ?? "";
      }

      solicitudUpdate.status = "Aceptada";
      solicitudUpdate.uid_taller = uid_taller != null ? uid_taller : "";

      for (const key of Object.keys(body)) {
        if (key !== "uid_propuesta" && key !== "status") {
          solicitudUpdate[key] = body[key];
        }
      }
      await solicitudRef.update(solicitudUpdate);

      // Notificar al taller que su propuesta fue aceptada
      await notifyTallerPropuestaAceptada(uid_taller);
    }

    return res.status(200).json({
      message: "Propuesta actualizada correctamente.",
      id: uid_propuesta.trim(),
    });
  } catch (error) {
    console.error("Error al actualizar propuesta:", error);
    return res
      .status(500)
      .json({ error: `Error al actualizar propuesta: ${error.message}` });
  }
};

const getPropuestasByStatus = async (req, res) => {
  try {
    const { status, uid_taller } = req.body || {};

    if (!status || typeof status !== "string" || status.trim() === "") {
      return res
        .status(400)
        .json({ error: "status es requerido." });
    }
    if (!uid_taller || typeof uid_taller !== "string" || uid_taller.trim() === "") {
      return res
        .status(400)
        .json({ error: "uid_taller es requerido." });
    }

    const snapshot = await db
      .collection("Propuestas")
      .where("status", "==", status.trim())
      .where("uid_taller", "==", uid_taller.trim())
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const propuestas = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(propuestas);
  } catch (error) {
    console.error("Error al obtener propuestas por status:", error);
    return res
      .status(500)
      .json({ error: `Error al obtener propuestas: ${error.message}` });
  }
};

const ReportarPagoData = async (req, res) => {
  const {
    uid,
    emailZelle,
    cod_ref,
    bancoTranfe,
    identificacion,
    telefono,
    amount,
    paymentMethod,
    nombre,
    vigencia,
    cant_services,
    date,
    montoPago,
    SelectedBanco,
    SelectedBancoDestino,
    nombre_taller,
    base64
  } = req.body;

  try {
    const userId = uid;
    const timestamp = new Date().toISOString(); // Generar la fecha y hora actuales

    let imageUrl = '';
    if (base64 && base64.trim() !== '') {
      const newFileName = `paymentcommitment/${paymentMethod}_${userId}_${timestamp}.jpg`;
      const buffer = Buffer.from(base64, 'base64');
      const file = bucket.file(newFileName);

      // Subir la nueva imagen usando la función `uploadImage`
      await uploadImage(file, buffer);

      imageUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`;
    }

    const subscripcionData = {
      cantidad_servicios: cant_services == undefined ? "" : cant_services,
      comprobante_pago: {
        bancoDestino: SelectedBancoDestino == undefined ? "" : SelectedBancoDestino,
        bancoOrigen: SelectedBanco == undefined ? "" : SelectedBanco,
        cedula: identificacion == undefined ? "" : identificacion,
        correo: emailZelle == undefined ? "" : emailZelle,
        fechaPago: date == undefined ? "" : date,
        metodo: paymentMethod == undefined ? "" : paymentMethod,
        monto: montoPago == undefined ? "" : montoPago,
        numReferencia: cod_ref == undefined ? "" : cod_ref,
        telefono: telefono == undefined ? "" : telefono,
        comprobante: imageUrl,
      },
      monto: amount == undefined ? "" : amount,
      nombre: nombre == undefined ? "" : nombre,
      status: "Por Aprobar",
      taller_uid: userId == undefined ? "" : userId,
      vigencia: vigencia == undefined ? "" : vigencia,
      fecha_inicio: admin.firestore.Timestamp.now(),
      fecha_fin: vigencia ? admin.firestore.Timestamp.fromMillis(Date.now() + parseInt(vigencia) * 24 * 60 * 60 * 1000) : "",
      nombre_taller: nombre_taller == undefined ? "" : nombre_taller,
    };

    // Guardar en la colección Subscripciones
    const subscripcionRef = await db.collection('Subscripciones').add(subscripcionData);
    const subscripcionId = subscripcionRef.id;

    // Guardar en el campo subscripcion_actual del documento en la colección Usuarios
    await db
      .collection('Usuarios')
      .doc(userId)
      .update({ subscripcion_actual: subscripcionData });

    // Actualizar el campo estatus a false en los documentos de la colección Servicios donde uid_taller == userId
    const serviciosSnapshot = await db.collection('Servicios').where('uid_taller', '==', userId).get();

    const batch = db.batch();
    serviciosSnapshot.forEach((doc) => {
      batch.update(doc.ref, { estatus: false });
    });

    await batch.commit();

    return res.status(201).send({
      message: "Suscripción guardada con éxito.",
    });

  } catch (error) {
    console.error("Error al guardar la suscripción:", error);
    res.status(500).send("Error al guardar la suscripción");
  }
};

const AsociarPlan = async (req, res) => {
  const {
    uid,
    plan_uid
  } = req.body;

  try {
    const userId = uid;
    const timestamp = new Date().toISOString(); // Generar la fecha y hora actuales

    console.log("plan_uid", plan_uid);
    console.log("userId", userId);


    if (plan_uid == 'gratis') {
      const planRef = await db.collection("Planes").doc('IPbc9VN1kmvIwrZHzNpd').get();
      const planData = planRef.data();
      const userRef = await db.collection("Usuarios").doc(userId).get();
      const userData = userRef.data();


      const subscripcionData = {
        cantidad_servicios: planData.cantidad_servicios == undefined ? "" : planData.cantidad_servicios,
        comprobante_pago: {
          bancoDestino: "",
          bancoOrigen: "",
          cedula: "",
          correo: "",
          fechaPago: "",
          metodo: "",
          monto: "",
          numReferencia: "",
          telefono: "",
          comprobante: "",
        },
        monto: planData.monto == undefined ? "" : planData.monto,
        nombre: planData.nombre == undefined ? "" : planData.nombre,
        status: "Aprobado",
        taller_uid: userId == undefined ? "" : userId,
        vigencia: planData.vigencia == undefined ? "" : planData.vigencia,

        fecha_inicio: admin.firestore.Timestamp.now(),
        fecha_fin: planData.vigencia ? admin.firestore.Timestamp.fromMillis(Date.now() + parseInt(planData.vigencia) * 24 * 60 * 60 * 1000) : "",


        nombre_taller: userData.nombre == undefined ? "" : userData.nombre,
      };

      // Guardar en la colección Subscripciones
      console.log(subscripcionData);


      const subscripcionRef = await db.collection('Subscripciones').add(subscripcionData);
      const subscripcionId = subscripcionRef.id;
      console.log(subscripcionId);

      // Guardar en el campo subscripcion_actual del documento en la colección Usuarios
      await db
        .collection('Usuarios')
        .doc(userId)
        .update({ subscripcion_actual: subscripcionData });


      return res.status(201).send({
        message: "Suscripción guardada con éxito.",
      });

    } else {
      const planRef = await db.collection("Planes").doc(plan_uid).get();
      const planData = planRef.data();
      console.log(planData);
    }
  } catch (error) {
    console.error("Error al asociar el plan:", error);
    res.status(500).send("Error al asociar el plan");
  }

};


const getPlanesActivos3Days = async () => {
  try {
    const result = await db.collection("Usuarios")
      .where("subscripcion_actual.status", "==", "Aprobado")
      .get();

    if (result.empty) {
      return console.log("No se encontraron usuarios");
    }

    const usuarios = result.docs.map((doc) => doc.data());

    const fechaActual = new Date();
    const fechaEn3Dias = new Date();
    fechaEn3Dias.setDate(fechaActual.getDate() + 3);

    // Filtrar usuarios cuya fecha_fin esté a 3 días de la fecha actual
    const usuariosEn3Dias = usuarios.filter(usuario => {
      const { subscripcion_actual } = usuario;
      if (!subscripcion_actual || !subscripcion_actual.fecha_fin) {
        return false;
      }

      const fechaFin = subscripcion_actual.fecha_fin.toDate();

      // Verificar si la fecha_fin está entre hoy y 3 días
      const fechaInicio = new Date(fechaActual);
      fechaInicio.setHours(0, 0, 0, 0);

      const fechaFinComparacion = new Date(fechaEn3Dias);
      fechaFinComparacion.setHours(23, 59, 59, 999);

      return fechaFin >= fechaInicio && fechaFin <= fechaFinComparacion;
    });

    if (usuariosEn3Dias.length === 0) {
      return console.log("No se encontraron usuarios con subscripción que expire en 3 días");
    }

    // Mostrar los tokens de los usuarios que expiran en 3 días
    console.log("Usuarios con subscripción que expira en 3 días:");
    usuariosEn3Dias.forEach(async usuario => {
      console.log(`Token: ${usuario.token}`);

      //Send Notifications
      const message = {
        notification: {
          title: 'Notificacion de plan por vencer',
          body: 'Tu plan está por vencer en 3 días',
        },
        data: {
          secretCode: 'plantoexpire',
        },
        token: usuario.token,
      };

      try {
        const response = await admin.messaging().send(message);
        console.log("Successfully sent message:", response);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });



  } catch (error) {
    console.error("Error al actualizar usuarios y servicios:", error); // Muestra el error en la consola del servidor
    console.log(`Error al actualizar usuarios y servicios: ${error.message}`); // Muestra el mensaje del error
  }
};




const getPlanesActivos = async () => {
  try {
    const result = await db.collection("Usuarios")
      .where("subscripcion_actual.status", "==", "Aprobado")
      .get();

    if (result.empty) {
      return console.log("No se encontraron usuarios");
    }

    const usuarios = result.docs.map((doc) => doc.data());

    const fechaActual = new Date();

    const usuariosFiltrados = usuarios.filter(usuario => {


      const { subscripcion_actual } = usuario;

      // Si no existen fecha_inicio y fecha_fin, no tomar en cuenta este usuario
      if (!subscripcion_actual?.fecha_inicio || !subscripcion_actual?.fecha_fin) {
        return false;
      }
      
      const fechaInicio = subscripcion_actual?.fecha_inicio?.toDate();
      const fechaFin = subscripcion_actual?.fecha_fin?.toDate();
      return fechaActual < fechaInicio || fechaActual > fechaFin;
    });

    if (usuariosFiltrados.length === 0) {
      return console.log("No se encontraron usuarios con subscripción fuera de vigencia");
    }

    // Actualizar subscripcion_actual.cantidad_servicios a 0 y estatus a false en "Servicios"
    for (const usuario of usuariosFiltrados) {
      const userRef = db.collection("Usuarios").doc(usuario.uid);
      await userRef.update({ "subscripcion_actual.cantidad_servicios": 0, "subscripcion_actual.status": 'Vencido' });

      const serviciosSnapshot = await db.collection("Servicios")
        .where("uid_taller", "==", usuario.uid)
        .get();

      const batch = db.batch();
      serviciosSnapshot.forEach(doc => {
        const servicioRef = db.collection("Servicios").doc(doc.id);
        batch.update(servicioRef, { estatus: false });
      });

      await batch.commit();
    }

    console.log("Usuarios y servicios actualizados correctamente.");
  } catch (error) {
    console.error("Error al actualizar usuarios y servicios:", error); // Muestra el error en la consola del servidor
    console.log(`Error al actualizar usuarios y servicios: ${error.message}`); // Muestra el mensaje del error
  }




}


const getPlanesVencidos = async () => {
  try {
    const result = await db.collection("Usuarios")
      .where("subscripcion_actual.status", "==", "Vencido")
      .get();

    if (result.empty) {
      return console.log("No se encontraron usuarios");
    }

    const usuarios = result.docs.map((doc) => doc.data());

    const fechaActual = new Date();

    const usuariosFiltrados = usuarios.filter(usuario => {


      const { subscripcion_actual } = usuario;

      // Si no existen fecha_inicio y fecha_fin, no tomar en cuenta este usuario
      if (!subscripcion_actual?.fecha_inicio || !subscripcion_actual?.fecha_fin) {
        return false;
      }

      
      const fechaInicio = subscripcion_actual?.fecha_inicio?.toDate();
      const fechaFin = subscripcion_actual?.fecha_fin?.toDate();
      return fechaActual < fechaInicio || fechaActual > fechaFin;
    });

    if (usuariosFiltrados.length === 0) {
      return console.log("No se encontraron usuarios con subscripción fuera de vigencia");
    }

    // Actualizar subscripcion_actual.cantidad_servicios a 0 y estatus a false en "Servicios"
    for (const usuario of usuariosFiltrados) {
      const userRef = db.collection("Usuarios").doc(usuario.uid);
      await userRef.update({ "subscripcion_actual.cantidad_servicios": 0, "subscripcion_actual.status": 'Vencido' });

      const serviciosSnapshot = await db.collection("Servicios")
        .where("uid_taller", "==", usuario.uid)
        .get();

      const batch = db.batch();
      serviciosSnapshot.forEach(doc => {
        const servicioRef = db.collection("Servicios").doc(doc.id);
        batch.update(servicioRef, { estatus: false });
      });

      await batch.commit();
    }

    console.log("Usuarios y servicios actualizados correctamente.");
  } catch (error) {
    console.error("Error al actualizar usuarios y servicios:", error); // Muestra el error en la consola del servidor
    console.log(`Error al actualizar usuarios y servicios: ${error.message}`); // Muestra el mensaje del error
  }




}

const sendNotification = async (req, res) => {
  const { token, title, body, secretCode } = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    data: {
      secretCode: secretCode,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
    res.status(200).send({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send({ message: "Error sending message", error: error.message });
  }
};

const updateUsuarioDocumentacionConductor = async (req, res) => {
  try {
    const body = req.body || {};
    const uid = body.uid;

    if (!uid || typeof uid !== "string" || String(uid).trim() === "") {
      return res.status(400).json({ error: "Se debe proporcionar uid." });
    }

    const uidTrim = String(uid).trim();
    const userRef = db.collection("Usuarios").doc(uidTrim);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const existing = userSnap.data() || {};
    const patch = {};

    const docFields = [
      { bodyKey: "licencia_frente_base64", fileBase: "licencia_frente" },
      { bodyKey: "licencia_reverso_base64", fileBase: "licencia_reverso" },
      { bodyKey: "certificado_medico_frente_base64", fileBase: "certificado_medico_frente" },
      { bodyKey: "certificado_medico_reverso_base64", fileBase: "certificado_medico_reverso" },
    ];

    for (const { bodyKey, fileBase } of docFields) {
      if (!Object.prototype.hasOwnProperty.call(body, bodyKey)) continue;
      patch[bodyKey] = await usuarioConductorResolveDocField(
        uidTrim,
        body[bodyKey],
        bodyKey,
        fileBase,
        existing,
      );
    }

    if (Object.prototype.hasOwnProperty.call(body, "licencia_fecha_vencimiento")) {
      patch.licencia_fecha_vencimiento = vehiculoValueToTimestamp(body.licencia_fecha_vencimiento);
    }
    if (Object.prototype.hasOwnProperty.call(body, "certificado_medico_fecha_vencimiento")) {
      patch.certificado_medico_fecha_vencimiento = vehiculoValueToTimestamp(
        body.certificado_medico_fecha_vencimiento,
      );
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ error: "No se enviaron campos para actualizar." });
    }

    await userRef.update(patch);

    const patchResponse = { ...patch };
    for (const k of Object.keys(patchResponse)) {
      const v = patchResponse[k];
      if (v && typeof v.toDate === "function") {
        patchResponse[k] = v.toDate().toISOString();
      }
    }

    return res.status(200).json({
      message: "Documentación de conductor actualizada.",
      uid: uidTrim,
      ...patchResponse,
    });
  } catch (error) {
    console.error("Error al actualizar documentación de conductor:", error);
    return res.status(500).json({
      message: "Error al actualizar documentación de conductor",
      error: error.message,
    });
  }
};

const UpdateUsuariosAll = async (req, res) => {
  try {
    // Recibir los datos del cliente desde el cuerpo de la solicitud
    const { uid } = req.body

    // Actualizar el documento en la colección "Usuarios" con el UID proporcionado
    await db.collection("Usuarios").doc(uid).update(req.body);

    // Responder con un mensaje de éxito
    res
      .status(200)
      .send({ message: "Usuario actualizado con éxito", uid: uid });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);

    // En caso de error, responder con el mensaje correspondiente
    res
      .status(500)
      .send({
        message: "Error al actualizar el usuario",
        error: error.message,
      });
  }
};



const deleteUserFromAuth = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).send({ message: "El UID es requerido" });
    }

    await admin.auth().deleteUser(uid);

    await db.collection("Usuarios").doc(uid).delete();

    return res.status(200).send({ message: "Usuario eliminado exitosamente de Firebase Authentication y Firestore" });
  } catch (error) {
    console.error("Error al eliminar al usuario:", error);

    if (error.code === "auth/user-not-found") {
      return res.status(404).send({ message: "Usuario no encontrado en Firebase Authentication" });
    } else if (error.code === "not-found") {
      return res.status(404).send({ message: "Documento no encontrado en Firestore" });
    } else {
      return res.status(500).send({ message: "Error al eliminar al usuario", error: error.message });
    }
  }
};

const updateScheduleDate = async (req, res) => {
  const { uid, scheduled_visit } = req.body;

  await db.collection("Usuarios").doc(uid).update({ scheduled_visit: scheduled_visit });

  return res.status(200).send({ message: "Fecha de programación actualizada con éxito" });

}

const deleteVehiculo = async (req, res) => {
  try {
    const { uiduser, uidvehicle } = req.body || {};

    if (!uiduser || !uidvehicle) {
      return res.status(400).json({ error: "uiduser y uidvehicle son requeridos." });
    }

    const userId = String(uiduser).trim();
    const vehicleId = String(uidvehicle).trim();

    if (!userId || !vehicleId) {
      return res.status(400).json({ error: "uiduser y uidvehicle no pueden estar vacíos." });
    }

    const userRef = db.collection("Usuarios").doc(userId);
    const vehiculoRef = userRef.collection("Vehiculos").doc(vehicleId);

    const vehiculoDoc = await vehiculoRef.get();
    if (!vehiculoDoc.exists) {
      return res.status(404).json({ error: "Vehículo no encontrado para este usuario." });
    }

    const userSnap = await userRef.get();
    const userData = userSnap.data() || {};
    const currentNotif = Array.isArray(userData.notificacionesVehiculos)
      ? userData.notificacionesVehiculos
      : [];
    const notificacionesVehiculos = currentNotif.filter(
      (item) => !(item && typeof item === "object" && item.uidvehicle === vehicleId)
    );

    const storagePath = `vehicles/${userId}/${vehicleId}/${vehicleId}.jpg`;
    const file = bucket.file(storagePath);
    try {
      await file.delete();
    } catch (err) {
      console.warn("No se pudo eliminar la imagen del vehículo:", err.message || err);
    }

    const batch = db.batch();
    batch.delete(vehiculoRef);
    if (userSnap.exists) {
      batch.update(userRef, { notificacionesVehiculos });
    }
    await batch.commit();

    return res.status(200).json({
      message:
        "Vehículo, su imagen (si existía) y sus notificaciones asociadas fueron eliminados correctamente.",
      uiduser: userId,
      uidvehicle: vehicleId,
    });
  } catch (error) {
    console.error("Error al eliminar vehículo:", error);
    return res.status(500).json({
      error: `Error al eliminar vehículo: ${error.message}`,
    });
  }
};

const updateVehiculoKm = async (req, res) => {
  try {
    const { uid_user, uid_vehicle, km } = req.body || {};

    if (!uid_user || typeof uid_user !== "string" || uid_user.trim() === "") {
      return res.status(400).json({ error: "uid_user es requerido." });
    }
    if (!uid_vehicle || typeof uid_vehicle !== "string" || uid_vehicle.trim() === "") {
      return res.status(400).json({ error: "uid_vehicle es requerido." });
    }
    if (km === undefined || km === null || km === "") {
      return res.status(400).json({ error: "km es requerido." });
    }

    const kmNum = typeof km === "number" ? km : parseInt(String(km).trim(), 10);
    if (!Number.isFinite(kmNum) || kmNum < 0) {
      return res.status(400).json({ error: "km debe ser un número entero mayor o igual a 0." });
    }

    const userId = uid_user.trim();
    const vehicleId = uid_vehicle.trim();

    const userRef = db.collection("Usuarios").doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const vehiculoRef = userRef.collection("Vehiculos").doc(vehicleId);
    const vehiculoSnap = await vehiculoRef.get();
    if (!vehiculoSnap.exists) {
      return res.status(404).json({ error: "Vehículo no encontrado en este usuario." });
    }

    await vehiculoRef.update({ KM: kmNum });

    return res.status(200).json({
      message: "Kilometraje del vehículo actualizado.",
      uid_user: userId,
      uid_vehicle: vehicleId,
      KM: kmNum,
    });
  } catch (error) {
    console.error("Error al actualizar KM del vehículo:", error);
    return res.status(500).json({
      error: `Error al actualizar KM: ${error.message}`,
    });
  }
};


/** Deja solo ítems de notificaciones con active === true; elimina vehículos sin ninguna activa. */
const filterNotificacionesVehiculosSoloActivas = (notificacionesVehiculos) => {
  if (!Array.isArray(notificacionesVehiculos)) return [];
  return notificacionesVehiculos
    .map((veh) => {
      if (!veh || typeof veh !== "object") return null;
      const list = Array.isArray(veh.notificaciones) ? veh.notificaciones : [];
      const notificaciones = list.filter(
        (n) => n && typeof n === "object" && n.active === true,
      );
      return { ...veh, notificaciones };
    })
    .filter((veh) => veh && veh.notificaciones.length > 0);
};

const vehiculoCamposNotificacionDesdeDoc = (data) => {
  const d = data && typeof data === "object" ? data : {};
  return {
    vehiculo_marca: vehiculoCoalesceEmpty(d.vehiculo_marca),
    vehiculo_modelo: vehiculoCoalesceEmpty(d.vehiculo_modelo),
    vehiculo_placa: vehiculoCoalesceEmpty(d.vehiculo_placa),
    vehiculo_anio: vehiculoCoalesceEmpty(d.vehiculo_anio),
  };
};

const nombreUsuarioDesdeDocUsuario = (u) => {
  if (!u || typeof u !== "object") return "";
  const raw = u.nombre ?? u.Nombre ?? u.nombre_usuario;
  return vehiculoCoalesceEmpty(raw);
};

const startOfDayLocal = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

/** proximaRevision en DD/MM/YYYY → inicio de ese día local, o null si no es válido. */
const parseProximaRevisionDDMMYYYY = (raw) => {
  if (raw == null) return null;
  const str = String(raw).trim();
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  const year = parseInt(m[3], 10);
  const dt = new Date(year, month, day);
  if (dt.getFullYear() !== year || dt.getMonth() !== month || dt.getDate() !== day) return null;
  return startOfDayLocal(dt);
};

const describeVehiculoParaNotificacion = (item) => {
  const marca = vehiculoCoalesceEmpty(item.vehiculo_marca);
  const modelo = vehiculoCoalesceEmpty(item.vehiculo_modelo);
  const placa = vehiculoCoalesceEmpty(item.vehiculo_placa);
  const anio = vehiculoCoalesceEmpty(item.vehiculo_anio);
  let nucleo = "tu vehículo";
  if (marca || modelo) nucleo = [marca, modelo].filter(Boolean).join(" ").trim() || nucleo;
  const partes = [];
  if (placa) partes.push(`placa ${placa}`);
  if (anio !== "" && anio != null) partes.push(`año ${anio}`);
  if (partes.length) return `${nucleo} (${partes.join(", ")})`;
  return nucleo;
};

const lineaFechaProximaRevision = (proximaRevision) => {
  const prox = vehiculoCoalesceEmpty(proximaRevision);
  return prox ? `Tenías anotada la fecha ${prox}.` : "";
};

const lineaFechaProgramadaProxima = (proximaRevision) => {
  const prox = vehiculoCoalesceEmpty(proximaRevision);
  return prox ? `La fecha que tienes programada es el ${prox}.` : "";
};

const textoDiasRestantes = (dias) =>
  dias === 1 ? "Falta 1 día" : `Faltan ${dias} días`;

/** meta: { kind: 'vencida' } | { kind: 'proxima', diasRestantes: number } (1–7) */
const mensajeMantenimientoPushPorSecretCode = (item, meta) => {
  const nombreUser = vehiculoCoalesceEmpty(item.nombre_usuario) || "amigo";
  const nombreTipo = vehiculoCoalesceEmpty(item.nombre) || "este mantenimiento";
  const veh = describeVehiculoParaNotificacion(item);
  const fechaTxtVenc = lineaFechaProximaRevision(item.proximaRevision);
  const fechaTxtProx = lineaFechaProgramadaProxima(item.proximaRevision);
  const cierreVenc =
    "Cuando puedas, agenda o revisa el servicio para seguir manejando con tranquilidad.";
  const cierreProx =
    "Te avisamos con tiempo para que puedas organizarlo sin apuros.";

  if (meta.kind === "proxima") {
    const diasTxt = textoDiasRestantes(meta.diasRestantes);
    switch (item.secretCode) {
      case "KMCorreTiempo":
        return {
          title: `${nombreUser}, se acerca la correa`,
          body: `Hola ${nombreUser}, ${diasTxt} para el mantenimiento de «${nombreTipo}» (correa o kit de distribución) de tu ${veh}. ${fechaTxtProx} ${cierreProx}`,
        };
      case "UltimaAlineacionRuedas":
        return {
          title: `${nombreUser}, alineación próxima`,
          body: `Hola ${nombreUser}, ${diasTxt} para la alineación de «${nombreTipo}» de tu ${veh}. ${fechaTxtProx} Ir a tiempo alinea bien los neumáticos. ${cierreProx}`,
        };
      case "UltimoAbastecimientoCombustible":
        return {
          title: `${nombreUser}, revisión de combustible cerca`,
          body: `Hola ${nombreUser}, ${diasTxt} para el seguimiento de «${nombreTipo}» (combustible) de tu ${veh}. ${fechaTxtProx} ${cierreProx}`,
        };
      case "UltimoCambioBujiasFiltro":
        return {
          title: `${nombreUser}, bujías o filtros pronto`,
          body: `Hola ${nombreUser}, ${diasTxt} para el mantenimiento de «${nombreTipo}» (bujías y filtro) de tu ${veh}. ${fechaTxtProx} ${cierreProx}`,
        };
      case "UltimoLavado":
        return {
          title: `${nombreUser}, lavado en la mira`,
          body: `Hola ${nombreUser}, ${diasTxt} para el «${nombreTipo}» (lavado) de tu ${veh}. ${fechaTxtProx} Un buen lavado mantiene bonito el auto. ${cierreProx}`,
        };
      case "UltimoMantenimientoSistemaInyeccion":
        return {
          title: `${nombreUser}, inyección a la vista`,
          body: `Hola ${nombreUser}, ${diasTxt} para el mantenimiento de «${nombreTipo}» (sistema de inyección) de tu ${veh}. ${fechaTxtProx} ${cierreProx}`,
        };
      case "UltimocambioAceite":
        return {
          title: `${nombreUser}, cambio de aceite cerca`,
          body: `Hola ${nombreUser}, ${diasTxt} para el «${nombreTipo}» (cambio de aceite) de tu ${veh}. ${fechaTxtProx} Reservar cita con anticipación le viene bien al motor. ${cierreProx}`,
        };
      default:
        return {
          title: `${nombreUser}, mantenimiento próximo`,
          body: `Hola ${nombreUser}, ${diasTxt} para «${nombreTipo}» de tu ${veh}. ${fechaTxtProx} ${cierreProx}`,
        };
    }
  }

  switch (item.secretCode) {
    case "KMCorreTiempo":
      return {
        title: `${nombreUser}, tu correa o kit de distribución`,
        body: `Hola ${nombreUser}, tu ${veh} ya superó la fecha del mantenimiento de «${nombreTipo}» (correa o kit de distribución). ${fechaTxtVenc} ${cierreVenc}`,
      };
    case "UltimaAlineacionRuedas":
      return {
        title: `${nombreUser}, alineación vencida`,
        body: `Hola ${nombreUser}, para tu ${veh} la alineación de ruedas de «${nombreTipo}» quedó con fecha vencida. ${fechaTxtVenc} Alinear a tiempo cuida los neumáticos y la conducción. ${cierreVenc}`,
      };
    case "UltimoAbastecimientoCombustible":
      return {
        title: `${nombreUser}, revisión de combustible`,
        body: `Hola ${nombreUser}, tu ${veh} tiene vencido el seguimiento de «${nombreTipo}» (abastecimiento de combustible). ${fechaTxtVenc} Un chequeo oportuno ayuda a detectar consumos raros. ${cierreVenc}`,
      };
    case "UltimoCambioBujiasFiltro":
      return {
        title: `${nombreUser}, bujías o filtros`,
        body: `Hola ${nombreUser}, tu ${veh} lleva vencido el mantenimiento de «${nombreTipo}» (bujías y filtro). ${fechaTxtVenc} Cambiarlos a tiempo mejora el arranque y el consumo. ${cierreVenc}`,
      };
    case "UltimoLavado":
      return {
        title: `${nombreUser}, momento de un buen lavado`,
        body: `Hola ${nombreUser}, para tu ${veh} la fecha de «${nombreTipo}» (lavado) ya pasó. ${fechaTxtVenc} Un lavado ayuda a cuidar la pintura y el valor del auto. ${cierreVenc}`,
      };
    case "UltimoMantenimientoSistemaInyeccion":
      return {
        title: `${nombreUser}, sistema de inyección`,
        body: `Hola ${nombreUser}, tu ${veh} tiene vencido el mantenimiento de «${nombreTipo}» (sistema de inyección). ${fechaTxtVenc} Revisarlo evita fallas y consumo extra. ${cierreVenc}`,
      };
    case "UltimocambioAceite":
      return {
        title: `${nombreUser}, cambio de aceite`,
        body: `Hola ${nombreUser}, tu ${veh} ya superó la fecha del «${nombreTipo}» (cambio de aceite). ${fechaTxtVenc} El aceite fresco es clave para el motor. ${cierreVenc}`,
      };
    default:
      return {
        title: `${nombreUser}, mantenimiento pendiente`,
        body: `Hola ${nombreUser}, tu ${veh} tiene vencido el mantenimiento de «${nombreTipo}». ${fechaTxtVenc} ${cierreVenc}`,
      };
  }
};

const enviarPushMantenimientoVencido = async (item, title, body) => {
  const token = item.token;
  if (!token || typeof token !== "string" || !token.trim()) {
    console.warn("Mantenimiento vencido: sin token FCM, uiduser=", item.uiduser);
    return;
  }
  const reqNotif = {
    body: {
      token: token.trim(),
      title: String(title).slice(0, 200),
      body: String(body).slice(0, 1024),
      secretCode: item.secretCode != null ? String(item.secretCode) : "",
    },
  };

  const resNotif = {
    status: () => ({
      send: () => {},
    }),
  };
  await sendNotification(reqNotif, resNotif);
};

/**
 * Por cada notificación activa: token, uiduser, uidvehicle, campos de la notificación y datos del doc Vehiculos.
 */
const expandNotificacionesVehiculosActivasConVehiculoDocs = async (usuariosConActivas) => {
  const items = [];
  const cache = new Map();

  const getCamposVehiculo = async (uiduser, uidvehicle) => {
    const key = `${uiduser}::${uidvehicle}`;
    if (cache.has(key)) return cache.get(key);
    const snap = await db
      .collection("Usuarios")
      .doc(uiduser)
      .collection("Vehiculos")
      .doc(uidvehicle)
      .get();
    const campos = snap.exists
      ? vehiculoCamposNotificacionDesdeDoc(snap.data())
      : vehiculoCamposNotificacionDesdeDoc(null);
    cache.set(key, campos);
    return campos;
  };

  for (const u of usuariosConActivas) {
    const uiduser = u.id;
    const token = vehiculoCoalesceEmpty(u.token);
    const bloques = Array.isArray(u.notificacionesVehiculos) ? u.notificacionesVehiculos : [];

    for (const veh of bloques) {
      if (!veh || typeof veh !== "object") continue;
      const uidvehicle =
        veh.uidvehicle != null && String(veh.uidvehicle).trim() !== ""
          ? String(veh.uidvehicle).trim()
          : "";
      if (!uidvehicle) continue;

      const camposVeh = await getCamposVehiculo(uiduser, uidvehicle);
      const notifs = Array.isArray(veh.notificaciones) ? veh.notificaciones : [];

      for (const notif of notifs) {
        if (!notif || typeof notif !== "object" || notif.active !== true) continue;
        items.push({
          token,
          uiduser,
          uidvehicle,
          ...notif,
          nombre_usuario: nombreUsuarioDesdeDocUsuario(u),
          ...camposVeh,
        });
      }
    }
  }

  return items;
};

/** Usuarios de la colección Usuarios que tienen el campo notificacionesVehiculos definido y no nulo (Firestore: != null excluye ausencia del campo). */
const getUsuariosConNotificacionesVehiculos = async () => {
  try {
    const snapshot = await db
      .collection("Usuarios")
      .where("notificacionesVehiculos", "!=", null)
      .get();

    if (snapshot.empty) {
      console.log("Job notificacionesVehiculos: no hay usuarios con ese campo.");
      return [];
    }

    const usuarios = snapshot.docs.map((doc) => {
      const data = doc.data();
      const notificacionesVehiculos = filterNotificacionesVehiculosSoloActivas(
        data.notificacionesVehiculos,
      );
      return {
        id: doc.id,
        ...data,
        notificacionesVehiculos,
      };
    });

    const conActivas = usuarios.filter((u) => u.notificacionesVehiculos.length > 0);

    const items = await expandNotificacionesVehiculosActivasConVehiculoDocs(conActivas);

    console.log(
      `Job notificacionesVehiculos: ${usuarios.length} usuario(s) con campo; ${conActivas.length} con active === true; ${items.length} ítem(s) expandido(s) con datos de Vehiculos/.`,
    );

    const hoy = startOfDayLocal(new Date());
    let conItemsParaPushMantenimiento = 0;
    const itemParaPushMantenimiento = [];
    for (const item of items) {
      const fechaProx = parseProximaRevisionDDMMYYYY(item.proximaRevision);
      if (!fechaProx) continue;
      if (fechaProx < hoy) {
        conItemsParaPushMantenimiento += 1;
        itemParaPushMantenimiento.push({
          ...item,
          _mantenimientoPushMeta: { kind: "vencida" },
        });
        continue;
      }
      const diasRestantes = Math.round(
        (fechaProx.getTime() - hoy.getTime()) / 86400000,
      );
      if (diasRestantes >= 1 && diasRestantes <= 7) {
        conItemsParaPushMantenimiento += 1;
        itemParaPushMantenimiento.push({
          ...item,
          _mantenimientoPushMeta: { kind: "proxima", diasRestantes },
        });
      }
    }
    if (conItemsParaPushMantenimiento > 0) {
      for (const item of itemParaPushMantenimiento) {
        const { title, body } = mensajeMantenimientoPushPorSecretCode(
          item,
          item._mantenimientoPushMeta,
        );
        await enviarPushMantenimientoVencido(item, title, body);
      }
    }

    return items;
  } catch (error) {
    console.error("Error al obtener usuarios con notificacionesVehiculos:", error);
    return [];
  }
};

/** secretCode en data FCM para km ≥ proximoKM (mantenimiento por odómetro vencido). */
const SECRET_CODE_PROXIMO_KM_SUPERADO = "ProximoKmSuperado";
/** secretCode en data FCM: faltan más de 0 y hasta 3000 km para llegar a proximoKM (3002 ya no entra). */
const SECRET_CODE_PROXIMO_KM_ADVERTENCIA = "ProximoKmAdvertenciaHasta3000";

const cronKmParseEnteroNoNegativo = (raw) => {
  if (raw === undefined || raw === null || raw === "") return null;
  const n = typeof raw === "number" ? raw : parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
};

const cronKmEnviarPushUsuario = async (token, title, body, secretCode) => {
  if (!token || typeof token !== "string" || !token.trim()) return false;
  const reqNotif = {
    body: {
      token: token.trim(),
      title: String(title).slice(0, 200),
      body: String(body).slice(0, 1024),
      secretCode: String(secretCode),
    },
  };
  const resNotif = {
    status: () => ({
      send: () => {},
    }),
  };
  try {
    await sendNotification(reqNotif, resNotif);
    return true;
  } catch (e) {
    console.error("cronKm push:", e.message, secretCode);
    return false;
  }
};

const cronKmMensajeSuperadoProximo = (ctx) => {
  const { nombre, vehDesc, nombreTipo, kmVehiculo, proximoKM } = ctx;
  return {
    title: `${nombre}, tocó el mantenimiento por km`,
    body: `Hola ${nombre}. Tu ${vehDesc} va en ${kmVehiculo} km y ya pasaste los ${proximoKM} km que tenías para «${nombreTipo}». Pasá por el taller o agendá cuando puedas.`,
  };
};

const cronKmMensajeAdvertenciaRango = (ctx) => {
  const { nombre, vehDesc, nombreTipo, kmVehiculo, proximoKM, kmRestantes } = ctx;
  const distancia =
    kmRestantes === 1
      ? "te falta solo 1 km"
      : `aún te quedan unos ${kmRestantes} km`;
  return {
    title: `${nombre}, un recordatorio de tus kilómetros`,
    body: `Hola ${nombre}. Tu ${vehDesc} va por ${kmVehiculo} km. Para «${nombreTipo}» tenías como referencia los ${proximoKM} km, y ${distancia} para acercarte a esa cifra. No va con prisa: solo tenlo en cuenta.`,
  };
};

/**
 * KM del doc Vehiculos vs proximoKM en la notificación (active === true).
 * - Si KM >= proximoKM: push amistoso (superaste el km objetivo).
 * - Si faltan de 1 a 3000 km para proximoKM: push advertencia (1200 sí; 3002 no).
 */
const cronKmEvaluarNotificacionActiva = async ({
  token,
  nombreUsuario,
  uidvehicle,
  notif,
  vehData,
}) => {
  const proximoKM = cronKmParseEnteroNoNegativo(notif.proximoKM);
  if (proximoKM === null) return { enviados: 0 };

  const kmVehiculo = cronKmParseEnteroNoNegativo(vehData?.KM);
  if (kmVehiculo === null) return { enviados: 0 };

  const nombreTipo = vehiculoCoalesceEmpty(notif.nombre) || "este mantenimiento";
  const vehDesc = describeVehiculoParaNotificacion(vehData || {});
  let enviados = 0;

  if (kmVehiculo >= proximoKM) {
    const { title, body } = cronKmMensajeSuperadoProximo({
      nombre: nombreUsuario,
      vehDesc,
      nombreTipo,
      kmVehiculo,
      proximoKM,
    });
    const ok = await cronKmEnviarPushUsuario(token, title, body, SECRET_CODE_PROXIMO_KM_SUPERADO);
    if (ok) enviados += 1;
    return { enviados };
  }

  const kmRestantes = proximoKM - kmVehiculo;
  if (kmRestantes >= 1 && kmRestantes <= 3000) {
    const { title, body } = cronKmMensajeAdvertenciaRango({
      nombre: nombreUsuario,
      vehDesc,
      nombreTipo,
      kmVehiculo,
      proximoKM,
      kmRestantes,
    });
    const ok = await cronKmEnviarPushUsuario(
      token,
      title,
      body,
      SECRET_CODE_PROXIMO_KM_ADVERTENCIA,
    );
    if (ok) enviados += 1;
  }

  return { enviados };
};

const jobNotificacionesVehiculosProximoKm = async () => {
  try {
    const snapshot = await db
      .collection("Usuarios")
      .where("notificacionesVehiculos", "!=", null)
      .get();

    if (snapshot.empty) {
      return;
    }

    let totalEnviados = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const bloques = filterNotificacionesVehiculosSoloActivas(data.notificacionesVehiculos);
      if (!bloques.length) continue;

      const token = vehiculoCoalesceEmpty(data.token);
      if (!token) continue;

      const nombreUsuario = nombreUsuarioDesdeDocUsuario(data) || "amigo";
      const uiduser = doc.id;
      const userRef = db.collection("Usuarios").doc(uiduser);

      for (const veh of bloques) {
        if (!veh || typeof veh !== "object") continue;
        const uidvehicle =
          veh.uidvehicle != null && String(veh.uidvehicle).trim() !== ""
            ? String(veh.uidvehicle).trim()
            : "";
        if (!uidvehicle) continue;

        const vehSnap = await userRef.collection("Vehiculos").doc(uidvehicle).get();
        if (!vehSnap.exists) continue;
        const vehData = vehSnap.data() || {};

        const notifs = Array.isArray(veh.notificaciones) ? veh.notificaciones : [];
        for (const notif of notifs) {
          if (!notif || typeof notif !== "object" || notif.active !== true) continue;
          const { enviados } = await cronKmEvaluarNotificacionActiva({
            token,
            nombreUsuario,
            uidvehicle,
            notif,
            vehData,
          });
          totalEnviados += enviados;
        }
      }
    }

    if (totalEnviados > 0) {
      console.log(`Job proximoKM (Vehiculos): ${totalEnviados} notificación(es) enviada(s).`);
    }
  } catch (error) {
    console.error("Error en job notificaciones proximoKM:", error);
  }
};

const SECRET_CODE_LICENCIA_VENC = "licencia_fecha_vencimiento";
const SECRET_CODE_CERT_MEDICO_VENC = "certificado_medico_fecha_vencimiento";

const firestoreFechaToStartOfDayLocal = (v) => {
  if (v == null) return null;
  let d;
  if (typeof v.toDate === "function") d = v.toDate();
  else if (v instanceof Date) d = new Date(v);
  else d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return startOfDayLocal(d);
};

const formatoFechaDDMMAAAA = (fechaInicioDia) => {
  const dd = String(fechaInicioDia.getDate()).padStart(2, "0");
  const mm = String(fechaInicioDia.getMonth() + 1).padStart(2, "0");
  const yyyy = fechaInicioDia.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

/** Vencida (antes de hoy) o faltan 1–30 días; si no aplica, null. */
const clasificarVencimientoDocumento = (fechaVencInicioDia) => {
  const hoy = startOfDayLocal(new Date());
  if (fechaVencInicioDia < hoy) return { kind: "vencida" };
  const diasRestantes = Math.round(
    (fechaVencInicioDia.getTime() - hoy.getTime()) / 86400000,
  );
  if (diasRestantes >= 1 && diasRestantes <= 30) {
    return { kind: "proxima", diasRestantes };
  }
  return null;
};

/** Vencida o faltan 1–31 días (~un mes); para RCV y trimestres del vehículo. */
const clasificarVencimientoDocumentoProximoMes = (fechaVencInicioDia) => {
  const hoy = startOfDayLocal(new Date());
  if (fechaVencInicioDia < hoy) return { kind: "vencida" };
  const diasRestantes = Math.round(
    (fechaVencInicioDia.getTime() - hoy.getTime()) / 86400000,
  );
  if (diasRestantes >= 1 && diasRestantes <= 31) {
    return { kind: "proxima", diasRestantes };
  }
  return null;
};

const enviarPushDocumentacionConductorJob = async (token, title, body, secretCode) => {
  if (!token || typeof token !== "string" || !token.trim()) return false;
  const reqNotif = {
    body: {
      token: token.trim(),
      title: String(title).slice(0, 200),
      body: String(body).slice(0, 1024),
      secretCode: String(secretCode),
    },
  };
  const resNotif = {
    status: () => ({
      send: () => {},
    }),
  };
  try {
    await sendNotification(reqNotif, resNotif);
    return true;
  } catch (e) {
    console.error("Push documentación conductor:", e.message, secretCode);
    return false;
  }
};

/**
 * Usuarios con licencia_fecha_vencimiento y/o certificado_medico_fecha_vencimiento.
 * Notifica si venció o faltan 1–30 días. secretCode en data: licencia_fecha_vencimiento | certificado_medico_fecha_vencimiento
 */
const jobNotificacionesLicenciaYCertificadoMedico = async () => {
  try {
    const [licSnap, certSnap] = await Promise.all([
      db.collection("Usuarios").where("licencia_fecha_vencimiento", "!=", null).get(),
      db.collection("Usuarios").where("certificado_medico_fecha_vencimiento", "!=", null).get(),
    ]);

    let enviados = 0;

    const procesarCampo = async (doc, campoFecha, secretCode, esLicencia) => {
      const data = doc.data();
      const fechaFin = firestoreFechaToStartOfDayLocal(data[campoFecha]);
      if (!fechaFin) return;
      const estado = clasificarVencimientoDocumento(fechaFin);
      if (!estado) return;

      const token = vehiculoCoalesceEmpty(data.token);
      if (!token) return;

      const nombre = nombreUsuarioDesdeDocUsuario({ ...data }) || "amigo";
      const fechaTxt = formatoFechaDDMMAAAA(fechaFin);

      let title;
      let body;
      if (esLicencia) {
        if (estado.kind === "vencida") {
          title = `${nombre}, tu licencia está vencida`;
          body = `Hola ${nombre}, tu licencia de conducir ya venció (fecha límite ${fechaTxt}). Renovála cuanto antes para seguir manejando con respaldo legal y tranquilidad.`;
        } else {
          const diasTxt =
            estado.diasRestantes === 1
              ? "Falta 1 día"
              : `Faltan ${estado.diasRestantes} días`;
          title = `${nombre}, licencia por vencer`;
          body = `Hola ${nombre}, ${diasTxt} para que venza tu licencia (${fechaTxt}). Te conviene iniciar la renovación con tiempo.`;
        }
      } else if (estado.kind === "vencida") {
        title = `${nombre}, certificado médico vencido`;
        body = `Hola ${nombre}, tu certificado médico para conducir ya venció (fecha límite ${fechaTxt}). Renuévalo para mantener tu documentación al día.`;
      } else {
        const diasTxt =
          estado.diasRestantes === 1
            ? "Falta 1 día"
            : `Faltan ${estado.diasRestantes} días`;
        title = `${nombre}, certificado médico por vencer`;
        body = `Hola ${nombre}, ${diasTxt} para el vencimiento de tu certificado médico (${fechaTxt}). Agenda tu cita médica con anticipación.`;
      }

      const ok = await enviarPushDocumentacionConductorJob(token, title, body, secretCode);
      if (ok) enviados += 1;
    };

    for (const doc of licSnap.docs) {
      await procesarCampo(doc, "licencia_fecha_vencimiento", SECRET_CODE_LICENCIA_VENC, true);
    }
    for (const doc of certSnap.docs) {
      await procesarCampo(
        doc,
        "certificado_medico_fecha_vencimiento",
        SECRET_CODE_CERT_MEDICO_VENC,
        false,
      );
    }

    if (enviados > 0) {
      console.log(`Job licencia/certificado médico: ${enviados} notificación(es) enviada(s).`);
    }
  } catch (error) {
    console.error("Error en job licencia/certificado médico:", error);
  }
};

const SECRET_CODE_RCV_VENC = "rcv_fecha_vencimiento";
const SECRET_CODE_TRIMESTRES_VENC = "trimestres_fecha_vencimiento";

/** Usuarios/{uid}/Vehiculos/{id} → uid */
const uidUsuarioDesdeRutaVehiculo = (docRef) => {
  const parts = docRef.path.split("/");
  if (parts.length >= 4 && parts[0] === "Usuarios" && parts[2] === "Vehiculos") {
    return parts[1];
  }
  return null;
};

const obtenerUsuarioLiteParaJobVehiculo = async (uid, cache) => {
  if (cache.has(uid)) return cache.get(uid);
  const snap = await db.collection("Usuarios").doc(uid).get();
  if (!snap.exists) {
    const vacio = { token: "", nombre: "amigo" };
    cache.set(uid, vacio);
    return vacio;
  }
  const d = snap.data();
  const lite = {
    token: vehiculoCoalesceEmpty(d.token),
    nombre: nombreUsuarioDesdeDocUsuario(d) || "amigo",
  };
  cache.set(uid, lite);
  return lite;
};


const jobNotificacionesRcvYTrimestresVehiculos = async () => {
  try {
    const [rcvSnap, trimSnap] = await Promise.all([
      db.collectionGroup("Vehiculos").where("rcv_fecha_vencimiento", "!=", null).get(),
      db.collectionGroup("Vehiculos").where("trimestres_fecha_vencimiento", "!=", null).get(),
    ]);

    const userCache = new Map();
    let enviados = 0;

    const procesarVehiculoCampo = async (doc, campoFecha, secretCode, esRcv) => {
      const uid = uidUsuarioDesdeRutaVehiculo(doc.ref);
      if (!uid) return;

      const data = doc.data();
      const fechaFin = firestoreFechaToStartOfDayLocal(data[campoFecha]);
      if (!fechaFin) return;

      const estado = clasificarVencimientoDocumentoProximoMes(fechaFin);
      if (!estado) return;

      const { token, nombre } = await obtenerUsuarioLiteParaJobVehiculo(uid, userCache);
      if (!token) return;

      const veh = describeVehiculoParaNotificacion(data);
      const fechaTxt = formatoFechaDDMMAAAA(fechaFin);

      let title;
      let body;
      if (esRcv) {
        if (estado.kind === "vencida") {
          title = `${nombre}, RCV vencido`;
          body = `Hola ${nombre}, el RCV de tu ${veh} está vencido (fecha límite ${fechaTxt}). Renoválo para circular con la póliza al día.`;
        } else {
          const diasTxt =
            estado.diasRestantes === 1
              ? "Falta 1 día"
              : `Faltan ${estado.diasRestantes} días`;
          title = `${nombre}, RCV por vencer`;
          body = `Hola ${nombre}, ${diasTxt} para el vencimiento del RCV de tu ${veh} (${fechaTxt}), dentro del próximo mes. Te conviene renovarlo con tiempo.`;
        }
      } else if (estado.kind === "vencida") {
        title = `${nombre}, trimestres vencidos`;
        body = `Hola ${nombre}, la fecha de trimestres o circulación de tu ${veh} ya pasó (${fechaTxt}). Regulariza cuando puedas para evitar inconvenientes.`;
      } else {
        const diasTxt =
          estado.diasRestantes === 1
            ? "Falta 1 día"
            : `Faltan ${estado.diasRestantes} días`;
        title = `${nombre}, trimestres por vencer`;
        body = `Hola ${nombre}, ${diasTxt} para el vencimiento de trimestres de tu ${veh} (${fechaTxt}), dentro del próximo mes. Organiza el pago con calma.`;
      }

      const ok = await enviarPushDocumentacionConductorJob(token, title, body, secretCode);
      if (ok) enviados += 1;
    };

    for (const doc of rcvSnap.docs) {
      await procesarVehiculoCampo(doc, "rcv_fecha_vencimiento", SECRET_CODE_RCV_VENC, true);
    }
    for (const doc of trimSnap.docs) {
      await procesarVehiculoCampo(
        doc,
        "trimestres_fecha_vencimiento",
        SECRET_CODE_TRIMESTRES_VENC,
        false,
      );
    }

    if (enviados > 0) {
      console.log(`Job RCV/trimestres (Vehiculos): ${enviados} notificación(es) enviada(s).`);
    }
  } catch (error) {
    console.error("Error en job RCV/trimestres vehículos:", error);
  }
};

const SECRET_CODE_ACTUALIZAR_KM_VEHICULOS = "ActualizarKmVehiculos";

/**
 * Pone showModalKm = true en todos los documentos de Usuarios y envía push a quienes tengan token.
 * Pensado para ejecutarse ~cada 7 días vía cron (p. ej. semanal).
 */
const cargarKmVehiculos = async () => {
  try {
    const snapshot = await db.collection("Usuarios").get();
    if (snapshot.empty) {
      console.log("cargarKmVehiculos: no hay usuarios.");
      return;
    }

    const docs = snapshot.docs;
    const BATCH = 500;

    for (let i = 0; i < docs.length; i += BATCH) {
      const chunk = docs.slice(i, i + BATCH);
      const batch = db.batch();
      for (const doc of chunk) {
        batch.update(doc.ref, { showModalKm: true });
      }
      await batch.commit();
    }

    let pushes = 0;
    for (const doc of docs) {
      const data = doc.data();
      const token = vehiculoCoalesceEmpty(data.token);
      if (!token) continue;
      const nombre = nombreUsuarioDesdeDocUsuario(data) || "amigo";
      const title = `${nombre}, tu kilometraje`;
      const body = `Hola ${nombre}. Te pedimos un minuto: actualizá el km de tu vehículo en la app. Así mantenemos tus datos al día y los recordatorios te van a servir mucho mejor.`;
      const ok = await cronKmEnviarPushUsuario(
        token,
        title,
        body,
        SECRET_CODE_ACTUALIZAR_KM_VEHICULOS,
      );
      if (ok) pushes += 1;
    }

    console.log(
      `cargarKmVehiculos: ${docs.length} usuario(s) con showModalKm=true; ${pushes} push(es) con token.`,
    );
  } catch (error) {
    console.error("Error en cargarKmVehiculos:", error);
  }
};


module.exports = {
  getUsuarios,
  getNotificaciones,
  saveUpdateNotificationUser,
  updateNotificationUser,
  getVehiculosByUsuarioUid,
  getTiposVehiculo,
  saveOrUpdateVehiculo,
  SaveClient,
  SaveTaller,
  authenticateUser,
  getUserByUid,
  SaveTallerAll,
  UpdateTallerUsuarioDocs,
  SaveTallerExtended,
  restorePass,
  getTalleres,
  actualizarStatusUsuario,
  UpdateClient,
  UpdateTaller,
  getServicesByTalleruid,
  getServiceByUid,
  getActiveCategories,
  getSubcategoriesByCategoryUid,
  saveOrUpdateService,
  getPlanes,
  getMetodosPago,
  ReportarPagoData,
  saveSolicitud,
  getSolicitudesByUsuario,
  getSolicitudesByUsuarioAndStatus,
  getSolicitudByServicioUid,
  getPropuestasBySolicitud,
  savePropuesta,
  updateSolicitudStatus,
  updatePropuesta,
  getPropuestasByStatus,
  getPlanesActivos,
  sendNotification,
  UpdateUsuariosAll,
  updateUsuarioDocumentacionConductor,
  deleteUserFromAuth,
  getPlanesActivos3Days,
  getUsuariosConNotificacionesVehiculos,
  jobNotificacionesLicenciaYCertificadoMedico,
  jobNotificacionesRcvYTrimestresVehiculos,
  jobNotificacionesVehiculosProximoKm,
  AsociarPlan,
  updateScheduleDate,
  getPlanesVencidos,
  deleteVehiculo,
  updateVehiculoKm,
  cargarKmVehiculos,
  getServicesByTallerUidTrue
};
