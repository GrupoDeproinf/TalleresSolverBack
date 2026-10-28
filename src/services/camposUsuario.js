// Qué campos puede cambiar un usuario en su propio documento de Usuarios.
//
// Antes, SaveTallerAll, UpdateTallerUsuarioDocs y UpdateUsuariosAll guardaban
// todo lo que llegara en el cuerpo de la petición. Así un taller podía ponerse
// a sí mismo un plan, un estatus "Aprobado" o cambiar su tipo de usuario, y
// con UpdateTallerUsuarioDocs (abierto a cualquier sesión) incluso los de otro.
//
// Ahora cada punto guarda solo su lista de campos. Las listas salen de todo lo
// que han enviado las versiones de la app, también las antiguas que siguen
// instaladas. Lo que decide la plataforma (estatus, plan, suscripción,
// verificación del RIF, foto guardada) lo pone siempre el servidor.

// Perfil del negocio que el taller edita desde la app.
const CAMPOS_PERFIL_TALLER = [
  'nombre',
  'rif',
  'cedula',
  'phone',
  'email',
  'whatsapp',
  'estado',
  'Direccion',
  'ubicacion',
  'lat',
  'lng',
  'RegComercial',
  'Caracteristicas',
  'Tarifa',
  'Experiencia',
  'Garantia',
  'seguro',
  'agenteAutorizado',
  'LinkFacebook',
  'LinkInstagram',
  'LinkTiktok',
  'metodos_pago',
  'horarios_atencion',
];

// Documentos del taller. El servidor los sube a Storage y guarda la URL.
const CAMPOS_DOCUMENTOS_TALLER = [
  'rifIdFiscal',
  'permisoOperacion',
  'logotipoNegocio',
  'fotoFrenteTaller',
  'fotoInternaTaller',
];

// Preferencias y token de notificaciones (UpdateUsuariosAll).
const CAMPOS_PREFERENCIAS = ['token', 'showModalKm', 'showMaintenancePopup', 'categorias'];

// Límites para que nadie guarde textos u objetos enormes.
const MAX_TEXTO = 5000;
const MAX_OBJETO = 20000;
// Los documentos llegan en base64 (una foto o PDF): hasta ~15 MB de texto.
const MAX_DOCUMENTO = 15 * 1024 * 1024;

const tamanoJson = (v) => {
  try {
    return JSON.stringify(v).length;
  } catch (e) {
    return Infinity;
  }
};

/**
 * Copia del cuerpo solo los campos de la lista. Descarta los que vienen
 * vacíos de tipo (undefined o función) o que se pasan de tamaño.
 * Función pura.
 */
const soloPermitidos = (cuerpo, campos, { documentos = [] } = {}) => {
  const salida = {};
  if (!cuerpo || typeof cuerpo !== 'object') return salida;
  campos.forEach((campo) => {
    if (!Object.prototype.hasOwnProperty.call(cuerpo, campo)) return;
    const v = cuerpo[campo];
    if (v === undefined || typeof v === 'function') return;
    if (typeof v === 'string') {
      const max = documentos.includes(campo) ? MAX_DOCUMENTO : MAX_TEXTO;
      if (v.length > max) return;
    } else if (v !== null && typeof v === 'object') {
      if (tamanoJson(v) > MAX_OBJETO) return;
    }
    salida[campo] = v;
  });
  return salida;
};

/**
 * Nombre de la foto anterior a borrar en profileImages/. Solo se acepta una
 * foto del mismo usuario ("<uid>_3.jpg"); cualquier otra cosa se ignora para
 * que nadie pueda borrar archivos ajenos.
 */
const fotoPropiaParaBorrar = (uid, nombre) => {
  const n = String(nombre == null ? '' : nombre).trim();
  const u = String(uid == null ? '' : uid).trim();
  if (!n || !u) return '';
  if (n.includes('/') || n.includes('\\') || n.includes('..')) return '';
  return n.startsWith(`${u}_`) ? n : '';
};

/**
 * true si hay sesión y el uid del cuerpo es de otra persona (y quien llama no
 * es personal de Solvers). Sin sesión devuelve false: las versiones viejas de
 * la app no mandan token y eso lo decide el modo de AUTH_MODE.
 */
const esCuentaAjena = (sesion, uid, esStaff) => {
  if (!sesion || !sesion.uid) return false;
  if (esStaff(sesion)) return false;
  return String(uid == null ? '' : uid).trim() !== sesion.uid;
};

module.exports = {
  CAMPOS_PERFIL_TALLER,
  CAMPOS_DOCUMENTOS_TALLER,
  CAMPOS_PREFERENCIAS,
  soloPermitidos,
  fotoPropiaParaBorrar,
  esCuentaAjena,
};
