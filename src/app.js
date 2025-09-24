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

// Configuración de CORS - SOLUCIÓN DEFINITIVA
app.use((req, res, next) => {
  // Permitir cualquier origen
  res.header("Access-Control-Allow-Origin", "*");
  
  // Headers permitidos
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-KEY"
  );
  
  // Métodos permitidos
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Permitir credenciales
  res.header("Access-Control-Allow-Credentials", "true");
  
  // Manejar peticiones OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  
  next();
});

// Configuración de middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

app.use(morgan('dev'));

// Rutas
app.get('/', async (req, res) => {
  res.send('API arriba');
});

// Middleware adicional para CORS en todas las rutas
app.options('*', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-KEY");
  res.status(200).end();
});

app.use('/api/usuarios', usuarios);
app.use('/api/home', home);
app.use('/api/distance', distance);


// Job que se ejecuta cada 10 horas
cron.schedule('0 */10 * * *', () => {
  console.log('Ejecutando job cada 10 horas');
  Usuarios.getPlanesActivos();
  // Aquí va tu lógica del job
});

// Job que se ejecuta cada 10 horas
cron.schedule('0 */5 * * *', () => {
  console.log('Ejecutando job cada 5 horas');
  Usuarios.getPlanesActivos3Days();
});



module.exports = app;
