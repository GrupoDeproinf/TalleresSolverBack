const admin = require("firebase-admin");
const { db } = require("../firebase");

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
    const { Nombre, cedula, phone, email, password } = req.body;

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

    // Crear o actualizar el documento en la colección "Usuarios"
    const infoUserCreated = {
      uid: uid,
      nombre: Nombre,
      cedula: cedula,
      phone: phone,
      typeUser: "Cliente",
      email: email,
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
    // Recibir los datos del cliente desde el cuerpo de la solicitud
    const { Nombre, rif, phone, email, password } = req.body;

    // Verificar si ya existe un usuario con ese email en Firebase Authentication
    try {
      const userByEmail = await admin.auth().getUserByEmail(email);
      if (userByEmail) {
        return res
          .status(400)
          .send({ message: "Ya existe un usuario con este email." });
      }
    } catch (error) {
      // Si no existe el usuario, Firebase lanzará un error que ignoramos aquí
    }

    // Verificar si ya existe un usuario con ese número de teléfono en Firebase Authentication
    try {
      const userByPhone = await admin
        .auth()
        .getUserByPhoneNumber(`+58${phone}`);
      if (userByPhone) {
        return res.status(400).send({
          message: "Ya existe un usuario con este número de teléfono.",
        });
      }
    } catch (error) {
      // Si no existe el usuario, Firebase lanzará un error que ignoramos aquí
    }

    // Crear el usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      phoneNumber: `+58${phone}`,
      displayName: Nombre,
      disabled: false,
    });

    // Obtener el UID generado por Firebase Authentication
    const uid = userRecord.uid;

    // Crear el objeto que se guardará en la colección "Usuarios"
    const infoUserCreated = {
      uid: uid,
      nombre: Nombre,
      rif: rif,
      phone: phone,
      typeUser: "Taller",
      email: email,
      status: "Pendiente",
    };

    // Guardar el objeto en la colección "Usuarios"
    await db.collection("Usuarios").doc(uid).set(infoUserCreated);

    // Responder con el ID del documento creado y un mensaje de éxito
    res.status(201).send({ message: "Usuario creado con éxito", uid: uid });
  } catch (error) {
    // Manejo de errores específicos de Firebase
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
    } else {
      console.error("Error al guardar el usuario:", error);
      res
        .status(500)
        .send({ message: "Error al guardar el usuario", error: error.message });
    }
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
    const { uid } = req.body;

    // Verificar que el UID no esté vacío
    if (!uid) {
      return res.status(400).send({ message: "El UID es obligatorio." });
    }

    // Guardar el objeto en la colección "Usuarios"
    const result = await db.collection("Usuarios").doc(uid).set(req.body);

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
      return sendResetPasswordEmail(email, link, req);
    })
    .catch((error) => {
      // Some error occurred.
      console.log(error);
      res.status(500).send({ message: "No existe el usuario", error });
    });
};

const sendResetPasswordEmail = async (email, resetLink, req) => {
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
      puntuacion
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

      return res.status(200).send({
        message: "Servicio actualizado exitosamente",
        service: { id, ...serviceData },
      });
    } else {
      // Si `id` está vacío, crear un nuevo documento en la colección "Servicios"
      const newServiceRef = await db.collection("Servicios").add(serviceData);
      console.log("Servicio creado con ID:", newServiceRef.id);

      return res.status(201).send({
        message: "Servicio creado exitosamente",
        service: { id: newServiceRef.id, ...serviceData },
      });
    }
  } catch (error) {
    console.error("Error al guardar o actualizar el servicio:", error);
    res.status(500).send("Error al guardar o actualizar el servicio");
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
  saveOrUpdateService
};
