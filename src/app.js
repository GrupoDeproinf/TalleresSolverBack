const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cron = require('node-cron');
// Todas las tareas corren en hora de Venezuela (antes: hora del servidor = UTC, por eso llegaban a las 6 a. m.).
const CRON_TZ = { timezone: 'America/Caracas' };
const cronSchedule = (expr, fn) => cron.schedule(expr, fn, CRON_TZ);
const Usuarios = require('../src/services/usuarios.services');

// Routers (Express) por dominio
const usuarios = require('./routes/usuarios.routes');
const home = require('./routes/home.routes');
const distance = require('./routes/distance.routes');
const citas = require('./routes/citas.routes');
const Citas = require('./services/citas.services');
const { autenticacion, MODO: AUTH_MODE } = require('./middlewares/auth');
const { limites } = require('./middlewares/limites');

const app = express();

// CORS: solo estos orígenes web pueden llamar a la API desde el navegador
// (antes se respondía "*" a cualquiera). La app móvil no usa CORS, así que
// no le afecta. El panel se sirve en app.solversapp.com y en Firebase Hosting.
app.use(
  cors({
    origin: [
      "https://app.solversapp.com",
      "https://talleres-solvers-app.web.app",
      "https://talleres-solvers-app.firebaseapp.com",
      "https://solversapp.com",
      "https://www.solversapp.com",
      "http://localhost:5173",
    ],
    allowedHeaders: ["Authorization", "Content-Type", "Accept", "X-Requested-With"],
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

// Seguridad: verifica la sesión y aplica la regla de cada ruta (ver middlewares/auth.js).
console.log(`[auth] modo ${AUTH_MODE}`);
// Límite de peticiones por IP antes de verificar la sesión (ver middlewares/limites.js).
app.use('/api', limites);
app.use('/api', autenticacion);

app.use('/api/usuarios', usuarios);
app.use('/api/home', home);
app.use('/api/distance', distance);
app.use('/api/citas', citas);



// --- Tareas programadas (node-cron). Hora del servidor salvo que configures `timezone`. ---

// Cada 10 horas (minuto 0): estado de planes activos (getPlanesActivos).
cronSchedule('0 */10 * * *', () => {
  console.log('Ejecutando job cada 10 horas (getPlanesActivos)');
  Usuarios.getPlanesActivos();
});

// Cada 10 horas (minuto 0): usuarios con plan vencido (getPlanesVencidos).
cronSchedule('0 */10 * * *', () => {
  console.log('Ejecutando job cada 10 horas (getPlanesVencidos)');
  Usuarios.getPlanesVencidos();
});




// Una vez al día, 9:00 a. m.: aviso a talleres con plan por vencer (a 3 días,
// a 1 día y el día que vence; cada aviso se envía una sola vez por plan).
// Antes corría cada 5 horas y repetía el aviso hasta cinco veces al día.
cronSchedule('0 9 * * *', () => {
  console.log('Ejecutando job diario 9:00 (getPlanesActivos3Days)');
  Usuarios.getPlanesActivos3Days();
});


// Cada 5 minutos: aviso de registros de taller sin terminar (Req. 003).
// Solo envía si está configurado REGISTRO_INCOMPLETO_WEBHOOK_URL.
cronSchedule('*/5 * * * *', () => {
  require('./services/registroIncompleto')
    .revisarRegistrosIncompletos()
    .then((r) => {
      if (r.avisados || r.fallidos) console.log('Registros incompletos:', JSON.stringify(r));
    })
    .catch(() => {});
});

// Tasa oficial del BCV para la validación de pagos: al arrancar y cada hora.
const actualizarTasaBcv = () =>
  require('./services/tasaBcv')
    .actualizarTasa()
    .then((r) => {
      if (r.guardadas.length || r.historico) console.log('Tasa BCV:', JSON.stringify(r));
      else if (r.errores.length) console.error('Tasa BCV:', r.errores.join(' | '));
    })
    .catch(() => {});
cronSchedule('7 * * * *', actualizarTasaBcv);

// Número de referencia de las solicitudes (S-000123): al arrancar, numera las
// que se crearon antes de que existiera.
setTimeout(() => {
  require('./services/numeroSolicitud')
    .numerarSolicitudesAnteriores()
    .then((n) => n && console.log('Solicitudes numeradas:', n))
    .then(() => require('./services/numeroSolicitud').copiarNumeroAPropuestas())
    .then((n) => n && console.log('Presupuestos con número:', n))
    .catch((e) => console.error('numerarSolicitudesAnteriores:', e && e.message));
}, 20000);
setTimeout(actualizarTasaBcv, 15000);

// Diario a las 8:00 (Caracas): recordatorios de mantenimiento por fecha y por
// kilometraje, un solo aviso por persona con todo junto. Reemplaza a los dos
// jobs anteriores, que avisaban por cada mantenimiento todos los días.
cronSchedule('0 8 * * *', () => {
  Usuarios.jobRecordatoriosMantenimiento();
});





// Los dos siguientes son críticos (documentación de conductor y circulación); no desactivarlos en producción sin evaluar impacto.

// Diario a las 8:00 (Caracas): licencia y certificado médico (vencido o entre 1 y 30 días).
cronSchedule('0 8 * * *', () => {
  Usuarios.jobNotificacionesLicenciaYCertificadoMedico();
});

// Diario a las 8:00 (Caracas): RCV y trimestres por vehículo (vencido o vencimiento en ~un mes).
cronSchedule('0 8 * * *', () => {
  Usuarios.jobNotificacionesRcvYTrimestresVehiculos();
});

// Semanal: lunes 8:00 (Caracas) — showModalKm en usuarios y push para actualizar kilometraje.
cronSchedule('0 8 * * 1', () => {
  // cronSchedule('*/10 * * * * *', () => {
  console.log('Ejecutando job semanal (cargarKmVehiculos)');
  Usuarios.cargarKmVehiculos();
});

// Semanal: lunes 8:00 (Caracas) — resetea showModalKm y showMaintenancePopup a true en TODOS los documentos de Usuarios.
cronSchedule('0 8 * * 1', () => {
  console.log('Ejecutando job semanal (resetWeeklyPopupFlags)');
  Usuarios.resetWeeklyPopupFlags();
});

// Diario a las 8:00 (Caracas): propuestas antiguas (Cotizado/Inspección) y solicitudes en espera sin propuesta activa (reglas de más de 3 días).
cronSchedule('0 8 * * *', () => {
  Usuarios.jobRechazarPropuestasFechaPropuestaMayor3Dias();
});













// Cada hora (minuto 5, Caracas): recordatorio 24 h antes de cada cita confirmada.
cronSchedule('5 * * * *', () => {
  Citas.jobRecordatorios24h();
});

module.exports = app;
