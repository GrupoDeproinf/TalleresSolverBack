const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cron = require('node-cron');
const Usuarios = require('../src/services/usuarios.services');

// Routers (Express) por dominio
const usuarios = require('./routes/usuarios.routes');
const home = require('./routes/home.routes');
const distance = require('./routes/distance.routes');

const app = express();

// Cabeceras CORS permisivas (origen *; ajustar en producción si hace falta)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});


// Paquete cors: orígenes explícitos para el front (además del middleware anterior)
app.use(
  cors({
    origin: [
      "https://app.solversapp.com/",
      "https://solversapp.com/",
      "http://localhost:5173/",
    ],
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  })
);





// Configuración de middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

app.use(morgan('dev'));

// Prefijos de API
app.get('/', async (req, res) => {
  res.send('API arriba');
});

app.use('/api/usuarios', usuarios);
app.use('/api/home', home);
app.use('/api/distance', distance);



// --- Tareas programadas (node-cron). Hora del servidor salvo que configures `timezone`. ---

// Cada 10 horas (minuto 0): estado de planes activos (getPlanesActivos).
cron.schedule('0 */10 * * *', () => {
  console.log('Ejecutando job cada 10 horas (getPlanesActivos)');
  Usuarios.getPlanesActivos();
});

// Cada 10 horas (minuto 0): usuarios con plan vencido (getPlanesVencidos).
cron.schedule('0 */10 * * *', () => {
  console.log('Ejecutando job cada 10 horas (getPlanesVencidos)');
  Usuarios.getPlanesVencidos();
});




// Cada 5 horas (minuto 0): avisos FCM a talleres con plan por vencer en ventana ~3 días (getPlanesActivos3Days).
cron.schedule('0 */5 * * *', () => {
  console.log('Ejecutando job cada 5 horas (getPlanesActivos3Days)');
  Usuarios.getPlanesActivos3Days();
});


// Diario a las 10:00: pushes de mantenimiento según notificacionesVehiculos activas.
cron.schedule('0 10 * * *', () => {
  Usuarios.getUsuariosConNotificacionesVehiculos();
});

// Diario a las 10:00: odómetro vs próximo KM (superado o aviso si faltan 1–3000 km).
cron.schedule('0 10 * * *', () => {
  console.log('Ejecutando job diario (proximoKM / odómetro)');
  Usuarios.jobNotificacionesVehiculosProximoKm();
});





// Los dos siguientes son críticos (documentación de conductor y circulación); no desactivarlos en producción sin evaluar impacto.

// Diario a las 10:00: licencia y certificado médico (vencido o entre 1 y 30 días).
cron.schedule('0 10 * * *', () => {
  Usuarios.jobNotificacionesLicenciaYCertificadoMedico();
});

// Diario a las 10:00: RCV y trimestres por vehículo (vencido o vencimiento en ~un mes).
cron.schedule('0 10 * * *', () => {
  Usuarios.jobNotificacionesRcvYTrimestresVehiculos();
});

// Semanal: lunes 10:00 — showModalKm en usuarios y push para actualizar kilometraje.
cron.schedule('0 10 * * 1', () => {
  Usuarios.cargarKmVehiculos();
});

// Diario a las 10:00: propuestas antiguas (Cotizado/Inspección) y solicitudes en espera sin propuesta activa (reglas de más de 3 días).
cron.schedule('0 10 * * *', () => {
  Usuarios.jobRechazarPropuestasFechaPropuestaMayor3Dias();
});













module.exports = app;
