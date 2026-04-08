const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cron = require('node-cron');
const Usuarios = require('../src/services/usuarios.services');

// Rutas
const usuarios = require('./routes/usuarios.routes');
const home = require('./routes/home.routes');
const distance = require('./routes/distance.routes');

const app = express();

// Configuración de CORS
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

// Rutas
app.get('/', async (req, res) => {
  res.send('API arriba');
});

app.use('/api/usuarios', usuarios);
app.use('/api/home', home);
app.use('/api/distance', distance);


// Job que se ejecuta cada 30 segundos
// cron.schedule('*/30 * * * * *', () => {
//   console.log('Ejecutando job cada 30 segundos');
//   Usuarios.getPlanesActivos();
//   // Aquí va tu lógica del job
// });


// Job que se ejecuta cada 10 horas
cron.schedule('0 */10 * * *', () => {
  console.log('Ejecutando job cada 10 horas');
  Usuarios.getPlanesActivos();
});

cron.schedule('0 */10 * * *', () => {
  console.log('Ejecutando job cada 30 segundos');
  Usuarios.getPlanesVencidos();
});




// Job que se ejecuta cada 10 horas
cron.schedule('0 */5 * * *', () => {
  console.log('Ejecutando job cada 5 horas');
  Usuarios.getPlanesActivos3Days();
});


// Job cada 24 horas (10:00, hora del servidor): usuarios con notificacionesVehiculos
cron.schedule('0 10 * * *', () => {
  // console.log('Ejecutando job diario (usuarios con notificacionesVehiculos)');
  Usuarios.getUsuariosConNotificacionesVehiculos();
});

// Job cada 24 horas (10:00, hora del servidor): proximoKM vs KM (superado o aviso 1–3000 km)
cron.schedule('0 10 * * *', () => {
  // console.log('Ejecutando job diario (proximoKM / odómetro)');
  Usuarios.jobNotificacionesVehiculosProximoKm();
});





// Los proximos dos jobs no se pueden desactivar porque son muy importantes

// Job cada 24 horas (10:00, hora del servidor): licencia / certificado médico (1–30 días o vencido)
cron.schedule('0 10 * * *', () => {
  // console.log('Ejecutando job diario (licencia y certificado médico)');
  Usuarios.jobNotificacionesLicenciaYCertificadoMedico();
});

// Job cada 24 horas (10:00, hora del servidor): RCV y trimestres en Vehiculos (vencido o ~1 mes)
cron.schedule('0 10 * * *', () => {
  // console.log('Ejecutando job diario (RCV y trimestres por vehículo)');
  Usuarios.jobNotificacionesRcvYTrimestresVehiculos();
});


// Este es el job que hace que se vea el modal en el home 

// Cada 7 días (lunes 10:00, hora del servidor): showModalKm + push para actualizar km
cron.schedule('0 10 * * 1', () => {
  // console.log('Job semanal: showModalKm y recordatorio de kilometraje');
  Usuarios.cargarKmVehiculos();
});












module.exports = app;
