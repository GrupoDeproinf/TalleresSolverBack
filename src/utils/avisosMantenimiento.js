// Cuándo avisar al conductor de un mantenimiento (fecha o kilometraje).
//
// Antes cada mantenimiento avisaba todos los días mientras estuviera próximo
// o vencido, sin fin, y cada uno por separado. Ahora:
// - Próximo: un solo aviso al entrar en el plazo de aviso.
// - Vencido: el día que se detecta, a los 3 días, a los 7 días y después una
//   vez por semana, hasta que el conductor lo actualice.
// Si el conductor cambia la fecha o el kilometraje del mantenimiento (`ref`),
// el conteo vuelve a empezar.

const DIA_MS = 24 * 60 * 60 * 1000;
const HITOS_VENCIDO = [0, 3, 7];

/**
 * @param {object|undefined} prev  Estado guardado para este mantenimiento.
 * @param {'vencido'|'proximo'|null} estado  Estado de hoy.
 * @param {string} ref  Datos que, si cambian, reinician el conteo.
 * @param {number} hoyMs  Inicio del día de hoy, en ms.
 * @returns {{enviar: boolean, estado: object|null}}  estado null = no guardar nada.
 */
const decidirAvisoMantenimiento = (prev, estado, ref, hoyMs) => {
  const base = prev && prev.ref === ref ? prev : { ref };
  if (!estado) {
    // Al día: se olvida lo anterior para que un próximo vencimiento avise de nuevo.
    return { enviar: false, estado: null };
  }

  if (estado === "proximo") {
    if (base.proximo) return { enviar: false, estado: base };
    return { enviar: true, estado: { ...base, proximo: true, ultimoMs: hoyMs } };
  }

  // Vencido
  const desde = typeof base.vencidoDesdeMs === "number" ? base.vencidoDesdeMs : hoyMs;
  const dias = Math.max(0, Math.floor((hoyMs - desde) / DIA_MS));
  const hitos = Array.isArray(base.hitos) ? base.hitos : [];
  const pendientes = HITOS_VENCIDO.filter((h) => dias >= h && !hitos.includes(h));
  const siguiente = { ...base, vencidoDesdeMs: desde };

  if (pendientes.length) {
    // Si el job no corrió algún día, se manda uno solo y se dan por cubiertos.
    return {
      enviar: true,
      estado: { ...siguiente, hitos: [...hitos, ...pendientes], ultimoMs: hoyMs },
    };
  }
  const ultimo = typeof base.ultimoMs === "number" ? base.ultimoMs : desde;
  if (dias > 7 && hoyMs - ultimo >= 7 * DIA_MS) {
    return { enviar: true, estado: { ...siguiente, hitos, ultimoMs: hoyMs } };
  }
  return { enviar: false, estado: { ...siguiente, hitos } };
};

module.exports = { decidirAvisoMantenimiento, DIA_MS };
