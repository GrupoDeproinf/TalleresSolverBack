// controllers/locationController.js
const admin = require('firebase-admin');
const db = admin.firestore();

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function toRad(value) {
  return (value * Math.PI) / 180;
}

const getNearby = async (req, res) => {
  try {
    const { lat, lng, estado, radio } = req.body;

    if (!lat || !lng || !estado) {
      return res.status(400).json({
        error: 'Se requieren lat, lng y estado',
      });
    }

    const result = await db
      .collection('Usuarios')
      .where('status', '==', 'Aprobado')
      .where('typeUser', '==', 'Taller')
      .where('estado', '==', estado)
      .get();

    if (result.empty) {
      return res.status(404).json({ error: 'No se encontraron talleres.' });
    }

    const talleres = result.docs.map((doc) => {
      const data = doc.data();
      const distancia = calcularDistancia(lat, lng, data?.ubicacion?.lat, data?.ubicacion?.lng);
      return {
        id: doc.id,
        ...data,
        distancia,
      };
    });
    console.log(`Talleres encontrados: ${talleres.length}`);
    console.log(`Buscando talleres en un radio de ${radio} km desde (${lat}, ${lng})`);
    console.log(`Estado: ${estado}`);
    console.log(`Distancias calculadas: ${talleres.map(t => t.distancia).join(', ')}`);
    console.log(`Talleres antes de filtrar por radio:`, talleres);
    const cercanos = talleres
      .filter((t) => t.distancia <= radio)
      .sort((a, b) => a.distancia - b.distancia);
    console.log(`Talleres encontrados: ${talleres.length}`);

    console.log(`Talleres cercanos encontrados: ${cercanos.length}`);
    if (cercanos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron talleres cercanos.' });
    }

    console.log(`Talleres cercanos: ${cercanos.map(t => t.id).join(', ')}`);
    console.log(`Distancia promedio: ${cercanos.reduce((sum, t) => sum + t.distancia, 0) / cercanos.length} km`);

    return res.status(200).json({ talleres: cercanos });
  } catch (error) {
    console.error('Error al buscar talleres cercanos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getNearby };
