const admin = require("firebase-admin");
const { db, bucket } = require("../firebase");
const { Buffer } = require('buffer');

const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { app } = require("../../firebaseConfig"); // Asegúrate de la ruta correcta




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

const SaveClient = async (req, res) => {
  try {
    // Recibir los datos del cliente desde el cuerpo de la solicitud
    const { Nombre, cedula, phone, email, password, estado, base64 } = req.body;

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
    let imageUrl = '';
    if (base64) {
      const buffer = Buffer.from(base64, 'base64');
      const file = bucket.file(`profileImages/${uid}.jpg`);

      await file.save(buffer, {
        metadata: { contentType: 'image/jpeg' },
        public: true,
        validation: 'md5'
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
      image_perfil: imageUrl // Guardar la URL de la imagen de perfil
    };

    await db
      .collection("Usuarios")
      .doc(uid)
      .set(infoUserCreated, { merge: true });

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
    const { Nombre, rif, phone, email, password, whats, metodos_pago, estado, base64 } = req.body;

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
    let imageUrl = '';
    if (base64) {
      const buffer = Buffer.from(base64, 'base64');
      const file = bucket.file(`profileImages/${uid}.jpg`);

      await file.save(buffer, {
        metadata: { contentType: 'image/jpeg' },
        public: true,
        validation: 'md5'
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
      image_perfil: imageUrl // Guardar la URL de la imagen de perfil
    };

    await db.collection("Usuarios").doc(uid).set(infoUserCreated, { merge: true });

    // Responder con el ID del documento creado o actualizado
    res.status(201).send({ message: "Usuario guardado con éxito", uid: uid });
  } catch (error) {
    console.error("Error al guardar el usuario:", error);

    // Manejar errores específicos de Firebase
    if (error.code === "auth/email-already-exists") {
      return res.status(400).send({ message: "Este email ya está registrado." });
    } else if (error.code === "auth/phone-number-already-exists") {
      return res.status(400).send({ message: "Este número de teléfono ya está registrado." });
    } else if (error.code === "auth/invalid-phone-number") {
      return res.status(400).send({ message: "El número de teléfono no es válido." });
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

const SaveTallerAll = async (req, res) => {
  try {
    const { uid, base64 } = req.body;

    // Verificar que el UID no esté vacío
    if (!uid) {
      return res.status(400).send({ message: "El UID es obligatorio." });
    }

    // Subir la imagen de perfil al Storage si el base64 no está vacío ni nulo
    let imageUrl = '';
    if (base64 && base64.trim() !== '') {
      const file = bucket.file(`profileImages/${uid}.jpg`);

      // Eliminar la imagen anterior si existe
      await file.delete().catch((error) => {
        if (error.code !== 404) {
          console.error("Error al eliminar la imagen anterior:", error);
        }
      });

      // Subir la nueva imagen
      const buffer = Buffer.from(base64, 'base64');
      await file.save(buffer, {
        metadata: { contentType: 'image/jpeg' },
        public: true,
        validation: 'md5',
      });

      imageUrl = `https://storage.googleapis.com/${bucket.name}/profileImages/${uid}.jpg`;

      // Añadir la URL de la imagen al cuerpo de la solicitud
      req.body.image_perfil = imageUrl;
    }

    delete req.body.base64;
    
    // Guardar el objeto en la colección "Usuarios"
    const result = await db.collection("Usuarios").doc(uid).set(req.body, { merge: true });

    // Verificar si el resultado de Firestore es válido
    if (!result) {
      return res
        .status(500)
        .send({ message: "Error al guardar el usuario en Firestore." });
    }

    // Responder con el ID del documento creado y un mensaje de éxito
    res
      .status(201)
      .send({ message: "Usuario actualizado con éxito", uid: uid });
  } catch (error) {
    console.error("Error al guardar el usuario:", error);

    // Manejar errores específicos
    if (error.code === "permission-denied") {
      return res
        .status(403)
        .send({ message: "Permisos insuficientes para guardar el usuario." });
    } else if (error.code === "not-found") {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    // Error general
    res
      .status(500)
      .send({ message: "Error al guardar el usuario", error: error.message });
  }
};

const restorePass = async (req, res) => {
  // Recibir el email del cuerpo de la solicitud
  const { email } = req.body;
  // Generar el enlace de restablecimiento de contraseña
  await admin
    .auth()
    .generatePasswordResetLink(email)
    .then((link) => {
      return sendResetPasswordEmail(email, link, res);
    })
    .catch((error) => {
      // Some error occurred.
      console.log(error);
      res.status(500).send({ message: "No existe el usuario", error });
    });
};

const sendResetPasswordEmail = async (email, resetLink, res) => {
  // Configura el transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Puedes cambiarlo por el servicio de correo que uses
    auth: {
      user: "solverstalleres@gmail.com", // Tu correo electrónico
      pass: "difg cvzy ndhe fqzw", // Tu contraseña de correo electrónico
    },
  });

  // Configura el contenido del correo
  const mailOptions = {
    from: "solverstalleres@gmail.com",
    to: email, // Destinatario
    subject: "Restablecer Contraseña",
    html: `<p>Hola,</p>
               <p>Sigue este enlace para restablecer tu contraseña: <a href="${resetLink}">${resetLink}</a></p>
               <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.</p>
               <p>Gracias, Solvers</p>
               <p>Tu equipo</p>`,
  };

  // Envía el correo
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Correo de restablecimiento enviado." });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

const getTalleres = async (req, res) => {
  try {
    const result = await db
      .collection("Usuarios")
      .where("status", "!=", "Aprobado")
      .where("typeUser", "==", "Taller") // Filtrar documentos por typeUser
      .get();

    if (result.empty) {
      return res
        .status(404)
        .send('No se encontraron usuarios con el tipo "Taller"');
    }

    const usuarios = result.docs.map((doc) => doc.data());

    res.send(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).send("Error al obtener usuarios");
  }
};

const actualizarStatusUsuario = async (req, res) => {
  try {
    // Obtener el UID y el nuevo estado desde el cuerpo de la solicitud
    const { uid, nuevoStatus } = req.body;

    // Verificar que se haya proporcionado un UID y un nuevo estado
    if (!uid || !nuevoStatus) {
      return res.status(400).send({
        message: "El UID y el nuevo estado son requeridos",
      });
    }

    // Actualizar el campo 'status' en el documento del usuario
    await db.collection("Usuarios").doc(uid).update({
      status: nuevoStatus,
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
    const { uid, Nombre, cedula, phone, email } = req.body;

    // Crear el objeto que se actualizará en la colección "Usuarios"
    const updatedUserInfo = {
      nombre: Nombre,
      cedula: cedula,
      phone: phone,
      typeUser: "Cliente",
      email: email,
      uid: uid,
    };

    // Actualizar el documento en la colección "Usuarios" con el UID proporcionado
    await db.collection("Usuarios").doc(uid).update(updatedUserInfo);

    // Responder con un mensaje de éxito
    res
      .status(200)
      .send({ message: "Usuario actualizado con éxito", uid: uid });
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
      publicOrigin
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

      if (serviceData.estatus){

        if(!publicOrigin){
          // Consulta el documento específico en la colección "Usuarios"
          const userId = uid_taller; // Reemplaza esto con el ID del usuario correspondiente
          const userRef = db.collection("Usuarios").doc(userId);
    
          // Obtiene el valor actual de cantidad_servicios, lo convierte a número, le resta 1 y actualiza
          const userDoc = await userRef.get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0; // Convierte a número o usa 0 si no es válido
            cantidadServicios -= 1; // Resta 1
    
            await userRef.update({
              "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(), // Guarda nuevamente como string
            });
          }
        }

        return res.status(200).send({
          message: "Servicio actualizado exitosamente",
          service: { id, ...serviceData },
        });
      } else {

        if(publicOrigin){
          // Consulta el documento específico en la colección "Usuarios"
          const userId = uid_taller; // Reemplaza esto con el ID del usuario correspondiente
          const userRef = db.collection("Usuarios").doc(userId);
    
          // Obtiene el valor actual de cantidad_servicios, lo convierte a número, le resta 1 y actualiza
          const userDoc = await userRef.get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0; // Convierte a número o usa 0 si no es válido
            cantidadServicios += 1; // Resta 1
    
            await userRef.update({
              "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(), // Guarda nuevamente como string
            });
          }
        }



        return res.status(200).send({
          message: "Servicio actualizado exitosamente",
          service: { id, ...serviceData },
        });
      }




      
    } else {
      const newServiceRef = await db.collection("Servicios").add(serviceData);
      console.log("Servicio creado con ID:", newServiceRef.id);

      if (serviceData.estatus){

        if (!publicOrigin){
          // Consulta el documento específico en la colección "Usuarios"
          const userId = uid_taller; // Reemplaza esto con el ID del usuario correspondiente
          const userRef = db.collection("Usuarios").doc(userId);
    
          // Obtiene el valor actual de cantidad_servicios, lo convierte a número, le resta 1 y actualiza
          const userDoc = await userRef.get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0; // Convierte a número o usa 0 si no es válido
            cantidadServicios -= 1; // Resta 1
    
            await userRef.update({
              "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(), // Guarda nuevamente como string
            });
          }
        }
  
        return res.status(201).send({
          message: "Servicio creado exitosamente",
          service: { id: newServiceRef.id, ...serviceData },
        });

      } else {

        if (publicOrigin){
          // Consulta el documento específico en la colección "Usuarios"
          const userId = uid_taller; // Reemplaza esto con el ID del usuario correspondiente
          const userRef = db.collection("Usuarios").doc(userId);
    
          // Obtiene el valor actual de cantidad_servicios, lo convierte a número, le resta 1 y actualiza
          const userDoc = await userRef.get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            let cantidadServicios = parseInt(userData.subscripcion_actual.cantidad_servicios, 10) || 0; // Convierte a número o usa 0 si no es válido
            cantidadServicios += 1; // Resta 1
    
            await userRef.update({
              "subscripcion_actual.cantidad_servicios": cantidadServicios.toString(), // Guarda nuevamente como string
            });
          }
        }

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
    nombre_taller
  } = req.body;

  try {
    const userId = uid;  // Reemplaza con el ID del usuario correspondiente

    const subscripcionData = {
      cantidad_servicios: cant_services == undefined ? "" : cant_services,
      comprobante_pago: {
        bancoDestino: SelectedBancoDestino == undefined ? "" : SelectedBancoDestino,
        bancoOrigen: SelectedBanco == undefined ? "" : SelectedBanco,
        cedula:identificacion == undefined ? "" : identificacion,
        correo:emailZelle == undefined ? "" : emailZelle,
        fechaPago: date== undefined ? "" : emailZelle,
        metodo: paymentMethod == undefined ? "" : paymentMethod,
        monto:montoPago == undefined ? "" : montoPago,
        numReferencia: cod_ref == undefined ? "" : cod_ref,
        telefono: telefono == undefined ? "" : telefono,
        receiptFile: "" == undefined ? "" : "",
      },
      monto: amount == undefined ? "" : amount,
      nombre: nombre == undefined ? "" : nombre,
      status: "Por Aprobar",
      taller_uid: userId == undefined ? "" : userId,
      vigencia: vigencia == undefined ? "" : vigencia,
      nombre_taller:nombre_taller == undefined ? "" : nombre_taller,
    };

    // Guardar en la colección Subscripciones
    await db.collection('Subscripciones').add(subscripcionData);

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
    res.status(500).send("Error al guardar la suscripción");
  }
};


module.exports = {
  getUsuarios,
  SaveClient,
  SaveTaller,
  authenticateUser,
  getUserByUid,
  SaveTallerAll,
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
  ReportarPagoData
};
