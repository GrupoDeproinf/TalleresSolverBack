const admin = require("firebase-admin");
const { db } = require("../firebase");

const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { app } = require("../../firebaseConfig"); // Asegúrate de la ruta correcta

const getServicios = async (req, res) => {
  // Cambia el orden de req y res
  try {
    // Paso 1: Obtener todos los servicios
    const serviciosSnapshot = await db
      .collection("Servicios")
      .where("estatus", "==", true)
      .get();

    // Crear un array para almacenar los servicios con sus talleres asociados
    const serviciosConTalleres = [];

    // Iterar sobre los servicios y buscar los talleres relacionados
    for (const servicioDoc of serviciosSnapshot.docs) {
      const servicioData = servicioDoc.data();

      // Agregar el uid del servicio al objeto de datos
      servicioData.uid_servicio = servicioDoc.id;

      // serviciosConTalleres contendrá los objetos con el `uid_servicio` incluido

      // Obtener el UID del taller del servicio
      const uidTaller = servicioData.uid_taller;

      // Validar que uid_taller exista y sea una cadena válida
      if (
        uidTaller &&
        typeof uidTaller === "string" &&
        uidTaller.trim() !== ""
      ) {
        // Obtener el taller asociado al servicio usando el uid_taller
        const tallerSnapshot = await db
          .collection("Usuarios")
          .doc(uidTaller)
          .get();

        // Solo agregar el servicio si el taller existe y está aprobado
        if (tallerSnapshot.exists) {
          const tallerData = tallerSnapshot.data();
          
          // Verificar que el taller esté aprobado
          if (tallerData.status === "Aprobado") {
            // Agregar el servicio junto con el taller a la lista
            serviciosConTalleres.push({
              ...servicioData,
              taller: tallerData,
            });
          } else {
            console.warn(
              `Taller ${uidTaller} no está aprobado para el servicio ${servicioDoc.id}. Servicio excluido.`
            );
          }
        } else {
          console.warn(
            `Taller no encontrado para el servicio ${servicioDoc.id}. Servicio excluido.`
          );
        }
      } else {
        console.warn(
          `UID de taller no válido para el servicio ${servicioDoc.id}`
        );
      }
    }

    console.log("Servicios con Talleres:", serviciosConTalleres);
    res.send(serviciosConTalleres);
  } catch (error) {
    console.error("Error obteniendo servicios y talleres:", error);
    res.status(500).send("Error obteniendo servicios y talleres.");
  }
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

/** Obtiene lat y lng desde taller.ubicacion (soporta .lat/.lng o .latitude/.longitude como en GeoPoint) */
const getLatLngFromUbicacion = (ubicacion) => {
  if (!ubicacion || typeof ubicacion !== "object") return { lat: NaN, lng: NaN };
  const lat = ubicacion.lat ?? ubicacion.latitude;
  const lng = ubicacion.lng ?? ubicacion.longitude;
  return {
    lat: lat != null ? Number(lat) : NaN,
    lng: lng != null ? Number(lng) : NaN,
  };
};

const calculateAverageScore = (comments) => {
  if (!Array.isArray(comments) || comments.length === 0) return 0;
  const totalScore = comments.reduce(
    (sum, comment) => sum + (comment?.puntuacion || 0),
    0,
  );
  const averageScore = totalScore / comments.length;
  return Math.min(Math.max(Math.ceil(averageScore), 0), 5);
};

const fetchCalificacionesServicio = async (uidService) => {
  const snap = await db
    .collection("Servicios")
    .doc(uidService)
    .collection("calificaciones")
    .get();
  if (snap.empty) return [];
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

const enriquecerServiciosConPuntuacion = async (items) => {
  if (!Array.isArray(items) || items.length === 0) return [];
  return Promise.all(
    items.map(async (item) => {
      const comments = await fetchCalificacionesServicio(item.id);
      const puntuacion = calculateAverageScore(comments);
      return { ...item, puntuacion };
    })
  );
};

const getServiciosPaginados = async (req, res) => {
  try {
    const {
      pageIndex = 1,
      pageSize = 10,
      filter: filterNombre = "",
      uid_categoria,
      id,
      latitude,
      longitude,
    } = req.body || {};

    const page = Math.max(1, parseInt(pageIndex, 10) || 1);
    const size = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 10));
    const filterStr =
      typeof filterNombre === "string" ? filterNombre.trim().toLowerCase() : "";

    const userLat = latitude != null ? Number(latitude) : NaN;
    const userLng = longitude != null ? Number(longitude) : NaN;
    const sortByDistance = !Number.isNaN(userLat) && !Number.isNaN(userLng);

    let query = db.collection("Servicios").where("estatus", "==", true);

    if (uid_categoria && typeof uid_categoria === "string" && uid_categoria.trim() !== "") {
      query = query.where("uid_categoria", "==", uid_categoria);
    }

    const serviciosSnapshot = await query.get();

    // Extraer uid_taller únicos para batch get (evita N+1)
    const uidTalleresUnicos = new Set();
    const serviciosPorTaller = new Map();
    for (const servicioDoc of serviciosSnapshot.docs) {
      const data = servicioDoc.data();
      const uidTaller = data.uid_taller;
      if (uidTaller && typeof uidTaller === "string" && uidTaller.trim() !== "") {
        uidTalleresUnicos.add(uidTaller);
        if (!serviciosPorTaller.has(uidTaller)) {
          serviciosPorTaller.set(uidTaller, []);
        }
        serviciosPorTaller.get(uidTaller).push({ doc: servicioDoc, data });
      } else {
        console.warn(`UID de taller no válido para el servicio ${servicioDoc.id}`);
      }
    }

    // Batch get de Usuarios (máx 30 por query en Firestore)
    const IN_LIMIT = 30;
    const uids = Array.from(uidTalleresUnicos);
    const talleresMap = new Map();
    for (let i = 0; i < uids.length; i += IN_LIMIT) {
      const chunk = uids.slice(i, i + IN_LIMIT);
      const talleresRef = db.collection("Usuarios");
      const snapshot = await talleresRef
        .where(admin.firestore.FieldPath.documentId(), "in", chunk)
        .where("subscripcion_actual.status", "==", "Aprobado")
        .get();
      snapshot.docs.forEach((d) => talleresMap.set(d.id, d.data()));
    }

    // Construir lista solo con talleres aprobados
    const serviciosConTalleres = [];
    for (const [uidTaller, talleres] of serviciosPorTaller) {
      const tallerData = talleresMap.get(uidTaller);
      if (!tallerData) {
        talleres.forEach(({ doc }) =>
          console.warn(`Taller no encontrado para el servicio ${doc.id}. Servicio excluido.`)
        );
        continue;
      }
      if (tallerData.status !== "Aprobado") {
        talleres.forEach(({ doc }) =>
          console.warn(
            `Taller ${uidTaller} no está aprobado para el servicio ${doc.id}. Servicio excluido.`
          )
        );
        continue;
      }
      for (const { doc: servicioDoc, data: servicioData } of talleres) {
        servicioData.uid_servicio = servicioDoc.id;
        const item = {
          id: servicioDoc.id,
          ...servicioData,
          taller: tallerData,
        };

        if (sortByDistance) {
          const { lat: tLat, lng: tLng } = getLatLngFromUbicacion(tallerData?.ubicacion);
          if (!Number.isNaN(tLat) && !Number.isNaN(tLng)) {
            item._distanceKm = getDistanceKm(userLat, userLng, tLat, tLng);
          } else {
            item._distanceKm = Infinity;
          }
        }

        serviciosConTalleres.push(item);
      }
    }

    // 1) Ordenar TODA la data por distancia: más cercano primero; sin ubicación al final
    if (sortByDistance && serviciosConTalleres.length > 0) {
      serviciosConTalleres.sort((a, b) => {
        const distA = a._distanceKm ?? Infinity;
        const distB = b._distanceKm ?? Infinity;
        return distA - distB;
      });
    }

    // 2) Filtro por nombre_servicio (like) sobre la lista ya ordenada
    let listado = serviciosConTalleres;
    if (filterStr.length > 0) {
      listado = listado.filter((s) => {
        const nombre =
          (s.nombre_servicio && String(s.nombre_servicio).toLowerCase()) || "";
        return nombre.includes(filterStr);
      });
    }

    const totalCount = listado.length;
    const from = (page - 1) * size;
    const paginated = listado.slice(from, from + size);
    const data = await enriquecerServiciosConPuntuacion(paginated);

    res.status(200).json({
      data,
      totalCount,
      pageIndex: page,
      pageSize: size,
    });
  } catch (error) {
    console.error("Error obteniendo servicios paginados:", error);
    res.status(500).send("Error obteniendo servicios paginados.");
  }
};

const saveContactService = async (req, res) => {
  try {
    const {
      id,
      nombre_servicio,
      precio,
      taller,
      uid_servicio,
      uid_taller,
      usuario_id,
      usuario_nombre,
      usuario_email,
    } = req.body || {};

    if (
      !id ||
      !nombre_servicio ||
      !precio ||
      !taller ||
      !uid_taller ||
      !usuario_id
    ) {
      return res.status(400).json({
        error: "Faltan campos obligatorios en el body de la solicitud.",
      });
    }

    const serviceData = {
      id,
      nombre_servicio,
      precio,
      taller,
      uid_servicio: uid_servicio || null,
      uid_taller,
      usuario: {
        id: usuario_id,
        nombre: usuario_nombre,
        email: usuario_email,
      },
      fecha_creacion: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("servicesContact").add(serviceData);

    return res
      .status(200)
      .json({ message: "Servicio guardado exitosamente.", serviceData });
  } catch (error) {
    console.error("Error al guardar el servicio:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

const getServicesContact = async (req, res) => {
  try {
    // Obtener todos los documentos de la colección "servicesContact"
    const serviciosContactSnapshot = await db
      .collection("servicesContact")
      .get();

    // Transformar el snapshot en un array de objetos con los datos de los documentos
    const serviciosContact = await Promise.all(
      serviciosContactSnapshot.docs.map(async (doc) => {
        const servicioContactData = doc.data();
        const { uid_servicio } = servicioContactData;

        // Buscar el servicio correspondiente en la colección "services"
        const servicioDoc = await db
          .collection("Servicios")
          .doc(uid_servicio)
          .get();

        // Verificar si existe el servicio
        const servicioData = servicioDoc.exists ? servicioDoc.data() : null;

        return {
          id: doc.id, // ID del documento en "servicesContact"
          ...servicioContactData, // Datos de "servicesContact"
          servicio: servicioData, // Datos del servicio asociado
        };
      })
    );

    console.log("Servicios con detalles:", serviciosContact);

    // Enviar los datos como respuesta
    res.status(200).json(serviciosContact);
  } catch (error) {
    console.error("Error obteniendo servicios y detalles:", error);
    res.status(500).send("Error obteniendo servicios y detalles.");
  }
};

const getServicesCategories = async (req, res) => {
  try {
    // Obtener la categoría enviada en el request
    const { uid_categoria, id } = req.body; // O req.body dependiendo del método HTTP

    if (!uid_categoria) {
      return res.status(400).send("Por favor, proporciona una categoría.");
    }

    // Consultar los documentos que coincidan con la categoría
    const serviciosSnapshot = await db
      .collection("Servicios")
      .where("uid_categoria", "==", uid_categoria)
      .where("uid_servicio", "!=", id == undefined ? '' : id)
      .where("estatus", "==", true) // Solo servicios habilitados
      .get();

    // Crear un array para almacenar los servicios válidos con talleres aprobados
    const serviciosValidos = [];

    // Iterar sobre los servicios y validar los talleres asociados
    for (const servicioDoc of serviciosSnapshot.docs) {
      const servicioData = servicioDoc.data();

      // Agregar el uid del servicio al objeto de datos
      servicioData.uid_servicio = servicioDoc.id;

      // Obtener el UID del taller del servicio
      const uidTaller = servicioData.uid_taller;

      // Validar que uid_taller exista y sea una cadena válida
      if (
        uidTaller &&
        typeof uidTaller === "string" &&
        uidTaller.trim() !== ""
      ) {
        // Obtener el taller asociado al servicio usando el uid_taller
        const tallerSnapshot = await db
          .collection("Usuarios")
          .doc(uidTaller)
          .get();

        // Solo agregar el servicio si el taller existe y está aprobado
        if (tallerSnapshot.exists) {
          const tallerData = tallerSnapshot.data();
          
          // Verificar que el taller esté aprobado
          if (tallerData.status === "Aprobado") {
            // Agregar el servicio a la lista de servicios válidos
            serviciosValidos.push({
              id: servicioDoc.id,
              ...servicioData,
            });
          } else {
            console.warn(
              `Taller ${uidTaller} no está aprobado para el servicio ${servicioDoc.id}. Servicio excluido.`
            );
          }
        } else {
          console.warn(
            `Taller no encontrado para el servicio ${servicioDoc.id}. Servicio excluido.`
          );
        }
      } else {
        console.warn(
          `UID de taller no válido para el servicio ${servicioDoc.id}`
        );
      }
    }

    // Si no hay servicios válidos, devolver un arreglo vacío
    if (serviciosValidos.length === 0) {
      return res.status(200).json([]);
    }

    // Obtener 3 servicios aleatorios de los servicios válidos
    const serviciosAleatorios = serviciosValidos
      .sort(() => Math.random() - 0.5) // Ordenar aleatoriamente
      .slice(0, 3); // Tomar los primeros 3 elementos

    console.log(
      `Servicios aleatorios con la categoría "${uid_categoria}":`,
      serviciosAleatorios
    );

    // Enviar los datos como respuesta
    res.status(200).json(serviciosAleatorios);
  } catch (error) {
    console.error("Error obteniendo servicios por categoría:", error);
    res.status(500).send("Error obteniendo servicios por categoría.");
  }
};

const getSubscriptionsById = async (req, res) => {
  try {
    // Obtener la categoría enviada en el request
    const { uid } = req.body; // O req.body dependiendo del método HTTP

    // Consultar los documentos que coincidan con la categoría
    const subscripcionesSnapchot = await db
      .collection("Subscripciones")
      .where("taller_uid", "==", uid)
      .get();

    // Transformar el snapshot en un array de objetos con los datos de los documentos
    const subscripciones = subscripcionesSnapchot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Si no hay subscripciones, devolver un arreglo vacío
    if (subscripciones.length === 0) {
      return res.status(200).json([]);
    }

    // Obtener 3 subscripciones aleatorios
    const subscripcionesAleatorios = subscripciones
      .sort(() => Math.random() - 0.5) // Ordenar aleatoriamente
      .slice(0, 3); // Tomar los primeros 3 elementos

    console.log(
      `subscripciones aleatorios con el uid "${uid}":`,
      subscripcionesAleatorios
    );

    // Enviar los datos como respuesta
    res.status(200).json(subscripcionesAleatorios);
  } catch (error) {
    console.error("Error obteniendo subscripciones por id:", error);
    res.status(500).send("Error obteniendo subscripciones por id.");
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    console.log("Cuerpo recibido:", req.body);
    const { uid_categoria } = req.body;

    if (!uid_categoria || typeof uid_categoria !== "string" || uid_categoria.trim() === "") {
      // return res.status(400).json({
      //   error: "uid_categoria es requerido y debe ser un string no vacío.",
      // });
      return res.status(200).json([]);
    }

    // 1️⃣ Consulta de productos por categoría
    const querySnapshot = await db
      .collection("Servicios")
      .where("uid_categoria", "==", uid_categoria.trim())
      .where("estatus", "==", true)
      .get();

    if (querySnapshot.empty) {
      return res.status(200).json([]);
      // return res.status(201).json({
      //   error: "No se encontraron productos para esta categoría.",
      // });
    }

    // 2️⃣ Obtener productos y recopilar IDs de taller
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const tallerIds = [...new Set(products.map(p => p.uid_taller))]; // evita duplicados

    // 3️⃣ Traer solo talleres aprobados que estén en esos IDs
    const talleresSnapshot = await db
      .collection("Usuarios")
      .where("status", "==", "Aprobado")
      .where("typeUser", "==", "Taller")
      .where("uid", "in", tallerIds)
      .get();

    const talleresMap = {};
    talleresSnapshot.forEach(doc => {
      talleresMap[doc.data().uid] = { id: doc.id, ...doc.data() };
    });

    // 4️⃣ Combinar producto con taller y filtrar solo productos con talleres aprobados
    const productsWithTaller = products
      .map(product => ({
        ...product,
        taller: talleresMap[product.uid_taller] || null,
      }))
      .filter(product => {
        // Solo incluir productos que tengan un taller aprobado asociado
        if (product.taller === null) {
          console.warn(
            `Producto ${product.id} excluido: taller ${product.uid_taller} no encontrado o no aprobado.`
          );
          return false;
        }
        return true;
      });

    return res.status(200).json(productsWithTaller);

  } catch (error) {
    return res.status(200).json([]);
    // console.error("Error al obtener productos:", error);
    // return res.status(500).json({ error: "Error al obtener productos" });
  }
};


const getCommentsByService = async (req, res) => {
  try {
    const { uid_service } = req.body;

    // Validar que uid_service esté definido y sea un string no vacío
    if (!uid_service || typeof uid_service !== "string" || uid_service.trim() === "") {
      return res.status(400).json({
        error: "uid_service es requerido y debe ser un string no vacío.",
      });
    }

    // Consultar el documento del servicio directamente por su ID
    const serviceDoc = await db.collection("Servicios").doc(uid_service).get();

    // Verificar si el documento existe
    if (!serviceDoc.exists) {
      return res
        .status(404)
        .json({ error: "No se encontró un servicio con este ID." });
    }

    // Obtener la subcolección "calificaciones"
    const commentsSnapshot = await db
      .collection("Servicios")
      .doc(uid_service)
      .collection("calificaciones") // Nombre de la subcolección
      .get();

    if (commentsSnapshot.empty) {
      return res.status(200).json([]);
    }

    const comments = commentsSnapshot.docs.map((commentDoc) => ({
      id: commentDoc.id,
      ...commentDoc.data(),
    }));

    // Responder con los comentarios encontrados
    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return res.status(500).json({ error: "Error al obtener comentarios" });
  }
};


const addCommentToService = async (req, res) => {
  try {
    const {
      uid_service, // Este será el ID del documento
      comentario,
      puntuacion,
      nombre_taller,
      uid_taller,
      usuario, // Mantén `usuario` como un objeto completo
    } = req.body;

    // Validar que el objeto `usuario` y el campo `userId` existan
    if (!usuario || !usuario.uid) {
      return res.status(400).json({
        error: 'El objeto "usuario" con el campo "userId" es obligatorio.',
      });
    }

    // Referencia al documento del servicio por su ID
    const serviceRef = db.collection("Servicios").doc(uid_service);
    const serviceDoc = await serviceRef.get();

    if (!serviceDoc.exists) {
      return res
        .status(404)
        .json({ error: "No se encontró un servicio con este ID de documento." });
    }

    // Crear un nuevo comentario en la subcolección "calificaciones"
    const newComment = {
      comentario,
      puntuacion,
      nombre_taller,
      uid_taller,
      usuario, // Incluye el objeto `usuario` tal cual
      fecha_creacion: new Date(), // Fecha de creación
    };

    await serviceRef.collection("calificaciones").add(newComment);

    // Responder con éxito
    return res.status(201).json({
      message: "Comentario agregado exitosamente.",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    return res.status(500).json({ error: "Error al agregar comentario." });
  }
};


const validatePhone = async (req, res) => {
  try {
    const { phone, uid } = req.body;

    // Verificar que se proporcionen los parámetros necesarios
    if (!phone) {
      return res
        .status(400)
        .send({ message: "El número de teléfono es obligatorio." });
    }

    // Buscar el número de teléfono en la colección "Usuarios"
    const snapshot = await db
      .collection("Usuarios")
      .where("phone", "==", phone)
      .get();

    if (!snapshot.empty) {
      const phoneExists = snapshot.docs.some((doc) => doc.id !== uid);

      if (phoneExists) {
        return res.status(409).send({
          message: "El número de teléfono ya está registrado.",
          valid: false,
        });
      }
    }

    // Si no hay conflictos, devolver que el número es válido
    return res.status(200).send({
      message: "El número de teléfono es válido.",
      valid: true,
    });
  } catch (error) {
    console.error("Error al validar el número de teléfono:", error);
    res.status(500).send({
      message: "Error al validar el número de teléfono.",
      error: error.message,
    });
  }
};

const validateEmail = async (req, res) => {
  try {
    const { email, uid } = req.body;

    // Verificar que se proporcionen los parámetros necesarios
    if (!email) {
      return res
        .status(400)
        .send({ message: "El correo electrónico es obligatorio." });
    }

    // Buscar el número de teléfono en la colección "Usuarios"
    const snapshot = await db
      .collection("Usuarios")
      .where("email", "==", email)
      .get();

    if (!snapshot.empty) {
      const phoneExists = snapshot.docs.some((doc) => doc.id !== uid);

      if (phoneExists) {
        return res.status(409).send({
          message: "El correo electrónico ya está registrado.",
          valid: false,
        });
      }
    }

    // Si no hay conflictos, devolver que el número es válido
    return res.status(200).send({
      message: "El correo electrónico es válido.",
      valid: true,
    });
  } catch (error) {
    console.error("Error al validar el correo electrónico:", error);
    res.status(500).send({
      message: "Error al validar el correo electrónico.",
      error: error.message,
    });
  }
};

module.exports = {
  getSubscriptionsById,
  getServicios,
  getServicesCategories,
  getServiciosPaginados,
  saveContactService,
  getServicesContact,
  getProductsByCategory,
  getCommentsByService,
  addCommentToService,
  validatePhone,
  validateEmail,
  savePerfilView,
};

/* ─── Registra una visita al perfil de un taller ─────────────────────────── */
async function savePerfilView(req, res) {
  try {
    const { id, nombre_taller, uid_taller, usuario } = req.body || {};

    if (!uid_taller) {
      return res.status(400).json({ error: "uid_taller es obligatorio." });
    }

    const docData = {
      // id:            id            || uid_taller,
      nombre_taller: nombre_taller || null,
      uid_taller,
      usuario: {
        id:     usuario?.id     || null,
        email:  usuario?.email  || null,
        nombre: usuario?.nombre || null,
      },
      fecha_creacion: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("perfilViews").add(docData);

    return res.status(200).json({ message: "Vista registrada.", data: docData });
  } catch (error) {
    console.error("[savePerfilView] Error:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}
