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

        // Si el taller existe, agregar su información al servicio
        const tallerData = tallerSnapshot.exists ? tallerSnapshot.data() : null;

        // Agregar el servicio junto con el taller a la lista
        serviciosConTalleres.push({
          ...servicioData,
          taller: tallerData,
        });
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
    const { nombre_categoria, id } = req.body; // O req.body dependiendo del método HTTP

    if (!nombre_categoria) {
      return res.status(400).send("Por favor, proporciona una categoría.");
    }

    // Consultar los documentos que coincidan con la categoría
    const serviciosSnapshot = await db
      .collection("Servicios")
      .where("nombre_categoria", "==", nombre_categoria)
      .where("uid_servicio", "!=", id) // Filtrar por categoría
      .get();

    // Transformar el snapshot en un array de objetos con los datos de los documentos
    const servicios = serviciosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Si no hay servicios, devolver un arreglo vacío
    if (servicios.length === 0) {
      return res.status(200).json([]);
    }

    // Obtener 3 servicios aleatorios
    const serviciosAleatorios = servicios
      .sort(() => Math.random() - 0.5) // Ordenar aleatoriamente
      .slice(0, 3); // Tomar los primeros 3 elementos

    console.log(
      `Servicios aleatorios con la categoría "${nombre_categoria}":`,
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
    // Log del cuerpo recibido (temporal para depuración)
    console.log("Cuerpo recibido:", req.body);

    // Obtener la categoría enviada en el request
    const { uid_categoria } = req.body;

    // Validar que uid_categoria esté definido y sea un string no vacío
    if (
      !uid_categoria ||
      typeof uid_categoria !== "string" ||
      uid_categoria.trim() === ""
    ) {
      return res.status(400).json({
        error: "uid_categoria es requerido y debe ser un string no vacío.",
      });
    }

    // Consulta a Firestore
    const querySnapshot = await db
      .collection("Servicios")
      .where("uid_categoria", "==", uid_categoria.trim())
      .where("estatus", "==", true)
      .get();

    // Verificar si hay productos en la categoría
    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ error: "No se encontraron productos para esta categoría." });
    }

    // Procesar los documentos del QuerySnapshot
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Respuesta con los productos obtenidos
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res.status(500).json({ error: "Error al obtener productos" });
  }
};

const getCommentsByService = async (req, res) => {
  try {
    const { uid_service } = req.body;

    // Validar que uid_service esté definido y sea un string no vacío
    if (
      !uid_service ||
      typeof uid_service !== "string" ||
      uid_service.trim() === ""
    ) {
      return res.status(400).json({
        error: "uid_service es requerido y debe ser un string no vacío.",
      });
    }

    // Consulta a Firestore para obtener el servicio
    const querySnapshot = await db
      .collection("Servicios")
      .where("uid_servicio", "==", uid_service)
      .get();

    // Verificar si se encontró el servicio
    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ error: "No se encontraron servicios para este UID." });
    }

    let comments = [];

    // Recorrer los documentos de servicios y obtener la subcolección "Comentarios"
    for (const doc of querySnapshot.docs) {
      const commentsSnapshot = await db
        .collection("Servicios")
        .doc(doc.id)
        .collection("calificaciones") // Nombre de la subcolección
        .get();

      // Si hay comentarios, agregarlos al arreglo
      if (!commentsSnapshot.empty) {
        commentsSnapshot.forEach((commentDoc) => {
          comments.push({ id: commentDoc.id, ...commentDoc.data() });
        });
      }
    }

    // Verificar si se encontraron comentarios
    if (comments.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron comentarios para este servicio." });
    }

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
  saveContactService,
  getServicesContact,
  getServicesCategories,
  getProductsByCategory,
  getCommentsByService,
  addCommentToService,
  validatePhone,
  validateEmail
};
