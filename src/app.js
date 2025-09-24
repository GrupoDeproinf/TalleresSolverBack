const express = require('express');
const morgan = require('morgan');
const cron = require('node-cron');
const cors = require('cors');
const Usuarios = require('../src/services/usuarios.services');

// Rutas
const usuarios = require('./routes/usuarios.routes');
const home = require('./routes/home.routes');
const distance = require('./routes/distance.routes');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: [
    'https://app.solversapp.com',
    'https://solversapp.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://localhost:5173'

  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

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
