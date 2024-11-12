const admin = require("firebase-admin");
const { db } = require("../firebase");

const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { app } = require("../../firebaseConfig"); // Asegúrate de la ruta correcta

const getServicios = async (req, res) => { // Cambia el orden de req y res
    try {
        // Paso 1: Obtener todos los servicios
        const serviciosSnapshot = await db.collection('Servicios').get();
        
        // Crear un array para almacenar los servicios con sus talleres asociados
        const serviciosConTalleres = [];

        // Paso 2: Iterar sobre los servicios y buscar los talleres relacionados
        for (const servicioDoc of serviciosSnapshot.docs) {
            const servicioData = servicioDoc.data();

            // Obtener el UID del taller del servicio
            const uidTaller = servicioData.uid_taller;

            // Validar que uid_taller exista y sea una cadena válida
            if (uidTaller && typeof uidTaller === 'string' && uidTaller.trim() !== '') {
                // Obtener el taller asociado al servicio usando el uid_taller
                const tallerSnapshot = await db.collection('Usuarios').doc(uidTaller).get();

                // Si el taller existe, agregar su información al servicio
                const tallerData = tallerSnapshot.exists ? tallerSnapshot.data() : null;

                // Agregar el servicio junto con el taller a la lista
                serviciosConTalleres.push({
                    ...servicioData,
                    taller: tallerData,
                });
            } else {
                console.warn(`UID de taller no válido para el servicio ${servicioDoc.id}`);
            }
        }

        console.log('Servicios con Talleres:', serviciosConTalleres);
        res.send(serviciosConTalleres);
    } catch (error) {
        console.error("Error obteniendo servicios y talleres:", error);
        res.status(500).send("Error obteniendo servicios y talleres.");
    }
};



module.exports = {
    getServicios
}