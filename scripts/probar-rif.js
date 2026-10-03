// Prueba manual de la validación del documento RIF.
// Uso: node scripts/probar-rif.js <RIF declarado> <nombre declarado> <archivo> [archivo...]
const fs = require('fs');
const path = require('path');
const { validarDocumentoRif, digitoVerificador, parseRif } = require('../src/services/rifDocumento');

(async () => {
  const [rif, nombre, ...archivos] = process.argv.slice(2);
  const p = parseRif(rif);
  if (p) console.log(`RIF declarado ${p.texto} · dígito verificador calculado: ${digitoVerificador(p.letra, p.numero)}`);
  for (const archivo of archivos) {
    const base64 = fs.readFileSync(archivo).toString('base64');
    const t0 = Date.now();
    const r = await validarDocumentoRif({ base64, rif, nombre });
    console.log(`\n${path.basename(archivo)} (${Math.round(base64.length * 0.75 / 1024)} KB, ${Date.now() - t0} ms)`);
    console.log(`  estado=${r.estado} metodo=${r.metodo} rifDocumento=${r.rifDocumento} vence=${r.fechaVencimiento} vencido=${r.vencido}`);
    console.log(`  razonSocial=${r.razonSocial} parecidoNombre=${r.parecidoNombre}`);
    console.log(`  mensaje: ${r.mensaje}`);
  }
})().catch((e) => { console.error('ERROR', e); process.exit(1); });
