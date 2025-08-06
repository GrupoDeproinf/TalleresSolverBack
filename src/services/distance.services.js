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
    const { lat, lng, radio } = req.body;

    if (!lat || !lng || !radio) {
      return res.status(400).json({
        error: 'Se requieren lat, lng y radio para buscar talleres cercanos.',
      });
    }

    const result = await db
      .collection('Usuarios')
      .where('status', '==', 'Aprobado')
      .where('typeUser', '==', 'Taller')
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

const getNearbyWithCategories = async (req, res) => {
  try {
    const { lat, lng, radio } = req.body;

    if (!lat || !lng || !radio) {
      return res.status(400).json({
        error: 'Se requieren lat, lng y radio para buscar talleres cercanos.',
      });
    }

    console.log(`🔍 Buscando talleres cerca de (${lat}, ${lng}) en un radio de ${radio} km`);

    const result = await db
      .collection("Usuarios")
      .where("status", "==", "Aprobado")
      .where("typeUser", "==", "Taller")
      .get();

    if (result.empty) {
      console.log('❌ No se encontraron talleres aprobados.');
      return res.status(404).json({ error: 'No se encontraron talleres.' });
    }

    const talleres = await Promise.all(
      result.docs.map(async (doc) => {
        const data = doc.data();
        const tallerId = doc.id;
        const ubicacion = data?.ubicacion;

        const distancia = calcularDistancia(lat, lng, ubicacion?.lat, ubicacion?.lng);

        console.log(`📍 Taller: ${tallerId}, distancia: ${distancia.toFixed(2)} km`);

        // Buscar servicios del taller
        const serviciosSnapshot = await db
          .collection("Servicios")
          .where("uid_taller", "==", tallerId)
          .get();

        console.log(`🛠️ Servicios del taller ${tallerId}: ${serviciosSnapshot.docs.length}`);

        // Construcción de categorías únicas por uid
        const categoriasMap = new Map();

        serviciosSnapshot.docs.forEach((servDoc, index) => {
          const servData = servDoc.data();
          const uid_categoria = servData?.uid_categoria ?? 'sin_id';
          const nombre_categoria = servData?.nombre_categoria ?? servData.categoria;

          console.log(`  └─ Servicio ${index + 1}:`, {
            uid_categoria,
            nombre_categoria,
          });

          // Solo guardar si no existe o si el nombre previo era "Sin nombre"
          if (!categoriasMap.has(uid_categoria) || categoriasMap.get(uid_categoria) === 'Sin nombre') {
            categoriasMap.set(uid_categoria, nombre_categoria ?? 'Sin nombre');
          }
        });

        const categoriasUnicas = Array.from(categoriasMap.entries()).map(([id, nombre]) => ({
          uid_categoria: id,
          nombre_categoria: nombre,
        }));

        console.log(`✅ Categorías únicas para ${tallerId}:`, categoriasUnicas);

        return {
          id: tallerId,
          ...data,
          distancia,
          categorias: categoriasUnicas,
        };
      })
    );

    const cercanos = talleres
      .filter((t) => t.distancia <= radio)
      .sort((a, b) => a.distancia - b.distancia);

    console.log(`📦 Total talleres encontrados: ${talleres.length}`);
    console.log(`📦 Talleres dentro del radio (${radio} km): ${cercanos.length}`);
    console.log(
      `📦 IDs de talleres cercanos:`,
      cercanos.map((t) => t.id).join(', ')
    );

    if (cercanos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron talleres cercanos.' });
    }

    return res.status(200).json({ talleres: cercanos });

  } catch (error) {
    console.error('🔥 Error al buscar talleres cercanos con categorías:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getNearby, getNearbyWithCategories };
