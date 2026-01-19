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

cron.schedule('*/30 * * * * *', () => {
  console.log('Ejecutando job cada 30 segundos');
  Usuarios.getPlanesVencidos();
});




// Job que se ejecuta cada 10 horas
cron.schedule('0 */5 * * *', () => {
  console.log('Ejecutando job cada 5 horas');
  Usuarios.getPlanesActivos3Days();
});



module.exports = app;
