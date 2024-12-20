const admin = require("firebase-admin");
const { db } = require("../firebase");

const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { app } = require("../../firebaseConfig"); // Asegúrate de la ruta correcta

const getServicios = async (req, res) => {
  // Cambia el orden de req y res
  try {
    // Paso 1: Obtener todos los servicios
    const serviciosSnapshot = await db.collection("Servicios").get();

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
  
      if (!id || !nombre_servicio || !precio || !taller || !uid_taller || !usuario_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios en el body de la solicitud.' });
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
  
      await db.collection('servicesContact').add(serviceData);
  
      return res.status(200).json({ message: 'Servicio guardado exitosamente.', serviceData });
    } catch (error) {
      console.error('Error al guardar el servicio:', error);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };


  const getServicesContact = async (req, res) => {
    try {
      // Obtener todos los documentos de la colección "servicesContact"
      const serviciosSnapshot = await db.collection("servicesContact").get();
  
      // Transformar el snapshot en un array de objetos con los datos de los documentos
      const servicios = serviciosSnapshot.docs.map((doc) => ({
        id: doc.id, // Incluir el ID del documento
        ...doc.data(), // Incluir los datos del documento
      }));
  
      console.log("Servicios con Talleres:", servicios);
  
      // Enviar los datos transformados como respuesta
      res.status(200).json(servicios);
    } catch (error) {
      console.error("Error obteniendo servicios y talleres:", error);
      res.status(500).send("Error obteniendo servicios y talleres.");
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
  
      console.log(`Servicios aleatorios con la categoría "${nombre_categoria}":`, serviciosAleatorios);
  
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
  
      console.log(`subscripciones aleatorios con el uid "${uid}":`, subscripcionesAleatorios);
  
      // Enviar los datos como respuesta
      res.status(200).json(subscripcionesAleatorios);
    } catch (error) {
      console.error("Error obteniendo subscripciones por id:", error);
      res.status(500).send("Error obteniendo subscripciones por id.");
    }
  };
  
  
  

module.exports = {
  getSubscriptionsById,
  getServicios,
  saveContactService,
  getServicesContact,
  getServicesCategories
};
