const admin = require("firebase-admin");
const { db, bucket } = require("../firebase");
const { Buffer } = require('buffer');

const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { app } = require("../../firebaseConfig"); // Asegúrate de la ruta correcta


const sendEmail = async (email, html, name) => {
  try {
    const axios = require("axios");

    // Validar que los parámetros necesarios estén presentes
    if (!email || !html || !name) {
      throw new Error("Email y contenido HTML son requeridos");
    }

    const data = JSON.stringify({
      sender: {
        name: "Solvers, C.A.",
        email: "solversappca@gmail.com",
      },
      to: [
        {
          email: email,
          name: name, // Usar la parte local del email como nombre
        },
      ],
      htmlContent: html,
      subject: "¡Bienvenido a Solvers!",
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.brevo.com/v3/smtp/email",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key":
          process.env.BREVO_API_KEY, // Usar variable de entorno para la API key
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
      token: token
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
      await sendEmail(email, htmlContent, Nombre);
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
      await sendEmail(email, htmlContent, Nombre);
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
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (authError) {
      console.error("Error en autenticación Firebase:", authError);
      if (authError.code === "auth/user-not-found") {
        return res.status(404).send({
          message: "Usuario no encontrado en Firebase Authentication",
          error: authError.code
        });
      } else if (authError.code === "auth/wrong-password") {
        return res.status(401).send({
          message: "Contraseña incorrecta",
          error: authError.code
        });
      } else if (authError.code === "auth/invalid-email") {
        return res.status(400).send({
          message: "Formato de email inválido",
          error: authError.code
        });
      } else if (authError.code === "auth/user-disabled") {
        return res.status(403).send({
          message: "Usuario deshabilitado",
          error: authError.code
        });
      } else if (authError.code === "auth/too-many-requests") {
        return res.status(429).send({
          message: "Demasiados intentos fallidos. Intenta más tarde",
          error: authError.code
        });
      } else {
        return res.status(500).send({
          message: "Error de autenticación",
          error: authError.code || authError.message
        });
      }
    }
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
    // host: "smtp.gmail.com",
    // port: 465, // Cambiar a 465 para SSL
    // secure: true, // Usar SSL
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

    const { estado } = req.body;

    const result = await db
      .collection("Usuarios")
      .where("status", "!=", "Aprobado")
      .where("typeUser", "==", "Taller") // Filtrar documentos por typeUser
      .where("estado", "==", estado) // Filtrar documentos por typeUser
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
      for (let i = 0; i < images.length; i++) {
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
      const fechaInicio = subscripcion_actual.fecha_inicio.toDate();
      const fechaFin = subscripcion_actual.fecha_fin.toDate();
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
  ReportarPagoData,
  getPlanesActivos,
  sendNotification,
  UpdateUsuariosAll,
  deleteUserFromAuth
};
