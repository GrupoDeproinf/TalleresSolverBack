const express = require('express');
const morgan = require('morgan');

// Rutas
const usuarios = require('./routes/usuarios.routes');
const home = require('./routes/home.routes');

const app = express();

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

module.exports = app;
