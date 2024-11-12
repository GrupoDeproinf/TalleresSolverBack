const express = require('express');
const morgan = require('morgan');

// Rutas
const usuarios = require('./routes/usuarios.routes');
const home = require('./routes/home.routes');

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.get('/', async (req, res) => {
  res.send('API arriba');
});

app.use('/api/usuarios', usuarios);
app.use('/api/home', home);

module.exports = app;
