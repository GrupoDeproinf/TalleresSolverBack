// Lectura de la foto de un documento del vehículo (certificado de circulación,
// título de propiedad o carnet) para llenar solo el formulario de "Agregar
// vehículo" en la app.
//
//   POST /usuarios/leerDocumentoVehiculo  { imagen_base64 }
//   → 200 { datos: { placa, marca, modelo, anio, color, tipo, documento } }
//   → 503 si la lectura no está configurada (falta ANTHROPIC_API_KEY)
//
// Es una ayuda: nunca guarda nada. El conductor ve los datos en el formulario
// y los corrige antes de guardar. Si no se puede leer, la app avisa y el
// conductor escribe a mano como siempre.
//
// Usa Claude (visión) con salida en JSON estructurado. Cada lectura cuesta
// del orden de un centavo de dólar; por eso hay un tope diario por usuario.

const Anthropic = require('@anthropic-ai/sdk');

const MODELO = 'claude-opus-5-5';
const MAX_BYTES = 6 * 1024 * 1024; // imagen ya decodificada
const TOPE_DIARIO_POR_USUARIO = Number(process.env.LECTURA_VEHICULO_TOPE_DIARIO || 15);
const TIPOS = ['Automóvil', 'Camión', 'Moto'];

let cliente = null;
const obtenerCliente = () => {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!cliente) cliente = new Anthropic({ timeout: 45 * 1000, maxRetries: 1 });
  return cliente;
};

// uid → { dia, usos }
const usosPorUsuario = new Map();
const hoy = () => new Date().toISOString().slice(0, 10);
const consumirCupo = (uid) => {
  const clave = String(uid || 'anonimo');
  const actual = usosPorUsuario.get(clave);
  const registro = actual && actual.dia === hoy() ? actual : { dia: hoy(), usos: 0 };
  if (registro.usos >= TOPE_DIARIO_POR_USUARIO) return false;
  registro.usos += 1;
  usosPorUsuario.set(clave, registro);
  return true;
};

const TEXTO_O_NULO = { anyOf: [{ type: 'string' }, { type: 'null' }] };

const ESQUEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['es_documento_vehicular', 'documento', 'placa', 'marca', 'modelo', 'anio', 'color', 'tipo'],
  properties: {
    es_documento_vehicular: { type: 'boolean' },
    documento: {
      type: 'string',
      enum: ['certificado_circulacion', 'titulo_propiedad', 'carnet_circulacion', 'otro'],
    },
    placa: TEXTO_O_NULO,
    marca: TEXTO_O_NULO,
    modelo: TEXTO_O_NULO,
    anio: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
    color: TEXTO_O_NULO,
    tipo: { anyOf: [{ type: 'string', enum: TIPOS }, { type: 'null' }] },
  },
};

const INSTRUCCIONES = `Vas a leer la foto de un documento de un vehículo de Venezuela (por ejemplo el certificado de circulación del INTT, el título de propiedad o el carnet de circulación).

Extrae solo lo que se lee con claridad en el documento:
- placa: tal como aparece, en mayúsculas y sin espacios ni guiones (ej. AB123CD).
- marca y modelo: como aparecen, con mayúscula inicial (ej. Toyota, Corolla).
- anio: el año del modelo del vehículo (4 cifras), no la fecha de emisión del documento.
- color: el color principal, con mayúscula inicial.
- tipo: "Moto" si es motocicleta; "Camión" si es camión, gandola, chuto o similar de carga pesada; "Automóvil" para carros, camionetas, rústicos y pickups.

Si un dato no aparece o no se lee con seguridad, pon null; no lo adivines.
Si la foto no es un documento de vehículo, marca es_documento_vehicular en false y deja los demás datos en null.`;

const limpiarTexto = (v, max = 40) => {
  if (v == null) return null;
  const t = String(v).replace(/\s+/g, ' ').trim().slice(0, max);
  return t || null;
};

const normalizar = (r) => {
  const anioMax = new Date().getFullYear() + 1;
  const anio = Number.isInteger(r.anio) && r.anio >= 1950 && r.anio <= anioMax ? r.anio : null;
  const placa = limpiarTexto(r.placa, 12);
  return {
    documento: r.documento || 'otro',
    placa: placa ? placa.toUpperCase().replace(/[^A-Z0-9]/g, '') || null : null,
    marca: limpiarTexto(r.marca),
    modelo: limpiarTexto(r.modelo),
    anio,
    color: limpiarTexto(r.color, 30),
    tipo: TIPOS.includes(r.tipo) ? r.tipo : null,
  };
};

const tipoDeImagen = (buffer) => {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg';
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png';
  if (buffer.slice(0, 4).toString() === 'RIFF' && buffer.slice(8, 12).toString() === 'WEBP') return 'image/webp';
  return null;
};

const leerDocumentoVehiculo = async (req, res) => {
  try {
    const crudo = String((req.body && req.body.imagen_base64) || '')
      .replace(/^data:image\/[a-z]+;base64,/i, '')
      .trim();
    if (!crudo) return res.status(400).json({ error: 'Falta la foto del documento.' });

    const buffer = Buffer.from(crudo, 'base64');
    if (!buffer.length || buffer.length > MAX_BYTES) {
      return res.status(400).json({ error: 'La foto es muy pesada. Intenta con otra.' });
    }
    const mediaType = tipoDeImagen(buffer);
    if (!mediaType) return res.status(400).json({ error: 'Envía la foto en JPG o PNG.' });

    const client = obtenerCliente();
    if (!client) {
      return res.status(503).json({ error: 'La lectura automática no está disponible por ahora.' });
    }

    const uid = req.sesion && req.sesion.uid;
    if (!consumirCupo(uid)) {
      return res.status(429).json({ error: 'Ya leímos muchas fotos hoy. Escribe los datos a mano.' });
    }

    const respuesta = await client.beta.messages.create({
      model: MODELO,
      max_tokens: 16000,
      output_config: {
        effort: 'low',
        format: { type: 'json_schema', schema: ESQUEMA },
      },
      // Si el modelo se negara, la API reintenta sola con otro modelo.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: buffer.toString('base64') } },
            { type: 'text', text: INSTRUCCIONES },
          ],
        },
      ],
    });

    if (respuesta.stop_reason === 'refusal' || respuesta.stop_reason === 'max_tokens') {
      return res.status(422).json({ error: 'No pudimos leer el documento. Escribe los datos a mano.' });
    }
    const texto = (respuesta.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
    let leido;
    try {
      leido = JSON.parse(texto);
    } catch (e) {
      return res.status(422).json({ error: 'No pudimos leer el documento. Escribe los datos a mano.' });
    }
    if (!leido || leido.es_documento_vehicular !== true) {
      return res.status(422).json({
        error: 'La foto no parece un documento del vehículo. Prueba con el certificado de circulación.',
      });
    }
    const datos = normalizar(leido);
    if (!datos.placa && !datos.marca && !datos.modelo && !datos.anio) {
      return res.status(422).json({ error: 'No se leen bien los datos. Toma la foto con más luz y sin reflejos.' });
    }
    return res.status(200).json({ datos });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return res.status(503).json({ error: 'La lectura está ocupada. Intenta en un minuto o escribe los datos a mano.' });
    }
    if (error instanceof Anthropic.APIConnectionError) {
      return res.status(503).json({ error: 'No pudimos leer el documento ahora. Escribe los datos a mano.' });
    }
    console.error('leerDocumentoVehiculo:', (error && error.status) || '', error && error.message);
    return res.status(500).json({ error: 'No pudimos leer el documento. Escribe los datos a mano.' });
  }
};

module.exports = { leerDocumentoVehiculo, normalizar, ESQUEMA };
