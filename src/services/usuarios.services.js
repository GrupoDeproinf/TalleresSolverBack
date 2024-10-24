const admin = require("firebase-admin");
const { db } = require("../firebase");

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
    res.status(500).send("Error al obtener usuarios");
  }
};

const SaveClient = async (req, res) => {
  try {
    // Recibir los datos del cliente desde el cuerpo de la solicitud
    const { Nombre, cedula, phone, email, password } = req.body;

    // Validar la entrada
    // if (!Nombre || !cedula || !phone || !email || !password) {
    //     return res.status(400).send('Todos los campos son requeridos');
    // }

    // Validar el formato del teléfono (ejemplo: debe tener 10 dígitos)
    const phoneRegex = /^\d{10}$/; // Cambiar a la longitud deseada
    if (!phoneRegex.test(phone)) {
      return res
        .status(400)
        .send("El teléfono debe contener 10 caracteres numéricos");
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
      cedula: cedula,
      phone: phone,
      typeUser: "Cliente",
      email: email,
    };

    // Guardar el objeto en la colección "Usuarios"
    await db.collection("Usuarios").doc(uid).set(infoUserCreated);

    // Responder con el ID del documento creado y un mensaje de éxito
    res.status(201).send({ message: "Usuario creado con éxito", uid: uid });
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
        .send({ message: "El numero telefonico ya existe" });
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

const authenticateUser = async (req, res) => {
  try {
    const { email } = req.body;

    console.log(email)
    console.log(req.body)

    // Buscar en la colección "Usuarios" por email
    const result = await db
      .collection("Usuarios")
      .where("email", "==", email)
      .get();

    if (result.empty) {
      console.log("No se encontró el usuario en la colección Usuarios");

      // Buscar en la colección "Admins" si no se encuentra en "Usuarios"
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
          uid: doc.id, // Incluye el UID del documento
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
        uid: doc.id, // Incluye el UID del documento
        ...doc.data(),
      }));
      return res.status(200).send({
        message: "Usuario autenticado exitosamente",
        userData: userData[0], // Enviar el primer documento encontrado con el UID
      });
    }
  } catch (error) {
    // Manejo de errores
    if (error.code === "auth/user-not-found") {
      return res.status(404).send({
        message: "Usuario no encontrado en Firebase Authentication",
      });
    } else {
      console.error("Error al autenticar al usuario:", error);
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
      console.log("Existe")
      console.log(userDoc)
      console.log("***********************************************")
      console.log(userDoc.data())
      // Si el documento existe, devolver los datos del usuario
      return res.status(200).send({
        message: "Usuario encontrado",
        userData: userDoc.data(), // Devuelve los datos del documento
      });
    } else {
      console.log("No Existe")
      // Si el documento no existe, devolver un mensaje de error
      return res.status(404).send({
        message: "No se encontró el usuario con el UID proporcionado",
      });
    }
  } catch (error) {
    console.error("Error al obtener el usuario por UID:", error);
    console.log("Dio errro")
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
    const { uid, nombre, rif, phone, email, Direccion, RegComercial, Caracteristicas, Tarifa, Experiencia, LinkFacebook, LinkInstagram, LinkTiktok, Garantia, seguro, agenteAutorizado } = req.body;

    // Crear el objeto con los datos que se actualizarán en la colección "Usuarios"
    const updatedUserInfo = {
      uid: uid,
      nombre: nombre == undefined ? '' : nombre,
      rif: rif == undefined ? '' : rif,
      phone: phone == undefined ? '' : phone,
      typeUser: 'Taller',
      email: email == undefined ? '' : email,
      Direccion: Direccion == undefined ? '' : Direccion,
      RegComercial: RegComercial == undefined ? '' : RegComercial,
      Caracteristicas: Caracteristicas == undefined ? '' : Caracteristicas,
      Tarifa: Tarifa == undefined ? '' : Tarifa,
      Experiencia: Experiencia == undefined ? '' : Experiencia,
      LinkFacebook: LinkFacebook == undefined ? '' : LinkFacebook,
      LinkInstagram: LinkInstagram == undefined ? '' : LinkInstagram,
      LinkTiktok: LinkTiktok == undefined ? '' : LinkTiktok,
      Garantia: Garantia == undefined ? '' : Garantia,
      seguro: seguro == undefined ? '' : seguro,
      agenteAutorizado: agenteAutorizado == undefined ? false : agenteAutorizado,
    };

    // Actualizar el documento en la colección "Usuarios" con el UID proporcionado
    await db.collection("Usuarios").doc(uid).update(updatedUserInfo);

    // Responder con un mensaje de éxito
    res.status(200).send({ message: "Usuario actualizado con éxito", uid: uid });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);

    // En caso de error, responder con el mensaje correspondiente
    res.status(500).send({ message: "Error al actualizar el usuario", error: error.message });
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
      uid:uid
    };

    // Actualizar el documento en la colección "Usuarios" con el UID proporcionado
    await db.collection("Usuarios").doc(uid).update(updatedUserInfo);

    // Responder con un mensaje de éxito
    res.status(200).send({ message: "Usuario actualizado con éxito", uid: uid });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);

    // Manejar posibles errores en la actualización del documento
    res.status(500).send("Error al actualizar el usuario");
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
  UpdateTaller
};
