// Prueba que los puntos de perfil solo guarden los campos permitidos, sin
// tocar la base real.
//   node scripts/probar-campos-usuario.js
const path = require('path');

const datos = {
  Usuarios: {
    t1: { typeUser: 'Taller', status: 'Aprobado', subscripcion_actual: { nombre: 'Plan Oro', status: 'Aprobado' } },
    t2: { typeUser: 'Taller', status: 'Aprobado' },
  },
};
const escrituras = [];
const db = {
  collection: (n) => ({
    doc: (id) => ({
      get: async () => ({ exists: !!datos[n][id], data: () => datos[n][id] }),
      set: async (d) => {
        escrituras.push({ id, d });
        datos[n][id] = Object.assign(datos[n][id] || {}, d);
      },
      update: async (d) => {
        escrituras.push({ id, d });
        datos[n][id] = Object.assign(datos[n][id] || {}, d);
      },
    }),
  }),
};
const borrados = [];
const bucket = {
  name: 'demo',
  getFiles: async () => [[]],
  file: (nombre) => ({ save: async () => {}, delete: async () => borrados.push(nombre) }),
};
require.cache[path.resolve(__dirname, '../src/firebase.js')] = {
  exports: { db, bucket, admin: {} },
  loaded: true,
  id: 'x',
};

const U = require('../src/services/usuarios.services');
const { soloPermitidos, fotoPropiaParaBorrar } = require('../src/services/camposUsuario');

const ok = (c, m) => {
  console.log(`${c ? '✔' : '✘'} ${m}`);
  if (!c) process.exitCode = 1;
};
const llamar = (fn, body, sesion) =>
  new Promise((resolve) => {
    const res = {
      code: 200,
      status(c) { this.code = c; return this; },
      send(b) { resolve({ code: this.code, body: b }); return this; },
      json(b) { resolve({ code: this.code, body: b }); return this; },
    };
    fn({ body, sesion }, res);
  });

(async () => {
  // Funciones puras
  const limpio = soloPermitidos({ nombre: 'A', status: 'Aprobado', plan: 'x', __proto__: { y: 1 } }, ['nombre', 'status']);
  ok(JSON.stringify(limpio) === '{"nombre":"A","status":"Aprobado"}', 'soloPermitidos copia solo la lista');
  ok(Object.keys(soloPermitidos({ nombre: 'x'.repeat(6000) }, ['nombre'])).length === 0, 'texto enorme se descarta');
  ok(fotoPropiaParaBorrar('t1', 't1_3.jpg') === 't1_3.jpg', 'foto propia se puede borrar');
  ok(fotoPropiaParaBorrar('t1', 't2_3.jpg') === '', 'foto de otro no');
  ok(fotoPropiaParaBorrar('t1', '../t1_3.jpg') === '', 'ruta con .. no');

  // SaveTallerAll: el cuerpo que manda la app hoy, más campos colados.
  let r = await llamar(U.SaveTallerAll, {
    uid: 't1',
    nombre: 'Taller Uno',
    typeUser: 'Taller',
    status: 'Aprobado',
    subscripcion_actual: { nombre: 'Plan Diamante', status: 'Aprobado' },
    rol: 'admin',
    ubicacion: { lat: 10.5, lng: -66.9 },
    metodos_pago: { efectivo: true },
    base64: '',
    imageTodelete: '',
  }, { uid: 't1', rol: 'Taller' });
  ok(r.code === 201, `SaveTallerAll responde 201 (${r.code})`);
  const t1 = datos.Usuarios.t1;
  ok(t1.nombre === 'Taller Uno' && t1.metodos_pago.efectivo === true && t1.ubicacion.lat === 10.5, 'guarda los campos del perfil');
  ok(t1.status === 'En espera por aprobación', `editar devuelve a revisión, no "Aprobado" (${t1.status})`);
  ok(t1.subscripcion_actual.nombre === 'Plan Oro', 'no puede cambiarse el plan');
  ok(t1.rol === undefined, 'no se cuelan campos desconocidos');

  // UpdateTallerUsuarioDocs sobre otra cuenta → 403
  r = await llamar(U.UpdateTallerUsuarioDocs, { uid: 't2', nombre: 'Hackeado' }, { uid: 't1', rol: 'Taller' });
  ok(r.code === 403 && datos.Usuarios.t2.nombre === undefined, `no puede editar el perfil de otro taller (${r.code})`);

  // UpdateTallerUsuarioDocs propio: estatus colado se ignora
  datos.Usuarios.t2.status = 'En espera de documentos';
  r = await llamar(U.UpdateTallerUsuarioDocs, {
    uid: 't2', nombre: 'Taller Dos', status: 'Aprobado', subscripcion_actual: { nombre: 'X' },
    rifIdFiscal: 'https://x/rif.pdf', permisoOperacion: '', logotipoNegocio: '',
    fotoFrenteTaller: 'https://x/f.jpg', fotoInternaTaller: 'https://x/i.jpg',
    horarios_atencion: { lunes: { abre: '08:00', cierra: '17:00' } },
  }, { uid: 't2', rol: 'Taller' });
  const t2 = datos.Usuarios.t2;
  ok(r.code === 200 || r.code === 201, `UpdateTallerUsuarioDocs propio funciona (${r.code})`);
  ok(t2.nombre === 'Taller Dos' && t2.horarios_atencion.lunes.abre === '08:00', 'guarda perfil y horarios');
  ok(t2.status === 'En espera por aprobación', `con documentos completos pasa a revisión, no "Aprobado" (${t2.status})`);
  ok(t2.subscripcion_actual === undefined, 'no puede ponerse un plan');

  // Personal de Solvers sí puede editar otra cuenta
  r = await llamar(U.UpdateTallerUsuarioDocs, { uid: 't2', Tarifa: '10' }, { uid: 'adm', rol: 'Admin' });
  ok((r.code === 200 || r.code === 201) && t2.Tarifa === '10', `un admin puede editar (${r.code})`);

  // Versión vieja sin token (sin sesión): sigue funcionando
  r = await llamar(U.UpdateUsuariosAll, { uid: 't1', token: 'fcm-1', status: 'Aprobado', typeUser: 'Admin' }, null);
  ok(r.code === 200 && t1.token === 'fcm-1', 'UpdateUsuariosAll guarda el token');
  ok(t1.status === 'En espera por aprobación' && t1.typeUser === 'Taller', 'pero no estatus ni tipo de usuario');
  r = await llamar(U.UpdateUsuariosAll, { uid: 't1', showModalKm: false }, { uid: 't1', rol: 'Taller' });
  ok(r.code === 200 && t1.showModalKm === false, 'preferencias se guardan');
  r = await llamar(U.UpdateUsuariosAll, { uid: 't2', token: 'robado' }, { uid: 't1', rol: 'Taller' });
  ok(r.code === 403 && t2.token === undefined, `no puede cambiar el token de otro (${r.code})`);
})();
