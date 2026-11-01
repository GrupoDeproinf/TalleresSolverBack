// Pruebas de la lectura del domicilio fiscal del RIF (datos inventados).
//   node scripts/probar-domicilio-rif.js
const assert = require('assert');
const { domicilioDesdeTexto, domicilioDesdePalabras, estadoDesdeDireccion } = require('../src/services/rifDomicilio');

let ok = 0;
const caso = (nombre, fn) => {
  fn();
  ok += 1;
  console.log('✓', nombre);
};

caso('estado explícito', () => assert.strictEqual(estadoDesdeDireccion('CALLE 5 CASA 12 SECTOR CENTRO MUNICIPIO SUCRE ESTADO MIRANDA'), 'Miranda'));
caso('estado con acentos', () => assert.strictEqual(estadoDesdeDireccion('AV PRINCIPAL LOCAL 3 MERIDA ESTADO MÉRIDA'), 'Mérida'));
caso('EDO. abreviado', () => assert.strictEqual(estadoDesdeDireccion('URB LOS PINOS CALLE 2 EDO. TÁCHIRA'), 'Táchira'));
caso('Distrito Capital', () => assert.strictEqual(estadoDesdeDireccion('AV URDANETA EDIF CENTRO PISO 2 CARACAS (LIBERTADOR) DISTRITO CAPITAL'), 'Distrito Capital'));
caso('Vargas → La Guaira', () => assert.strictEqual(estadoDesdeDireccion('CALLE REAL CASA 4 MAIQUETIA ESTADO VARGAS'), 'La Guaira'));
caso('municipio con nombre de estado', () => assert.strictEqual(estadoDesdeDireccion('MUNICIPIO SUCRE PARROQUIA PETARE ESTADO MIRANDA'), 'Miranda'));
caso('sin estado', () => assert.strictEqual(estadoDesdeDireccion('CALLE 1 CASA 2'), ''));

caso('PDF: bloque entre DOMICILIO FISCAL y ZONA POSTAL', () => {
  const r = domicilioDesdeTexto('RIF J-12345678-9 TALLER DEMO\nDOMICILIO FISCAL: AV BOLIVAR LOCAL 3\nVALENCIA ESTADO CARABOBO ZONA POSTAL 2001\nFECHA');
  assert.deepStrictEqual(r, { direccion: 'AV BOLIVAR LOCAL 3 VALENCIA ESTADO CARABOBO', estado: 'Carabobo' });
});
caso('PDF sin domicilio', () => assert.strictEqual(domicilioDesdeTexto('RIF J-12345678-9'), null));
caso('PDF con domicilio demasiado corto', () => assert.strictEqual(domicilioDesdeTexto('DOMICILIO FISCAL: X ZONA POSTAL'), null));

const p = (text, x0, y0) => ({ text, bbox: { x0, y0, x1: x0 + 10 * text.length, y1: y0 + 20 } });
caso('OCR: columna izquierda, sin el QR', () => {
  const r = domicilioDesdePalabras([
    p('RIF', 40, 20),
    p('DOMICILIO', 40, 100), p('FISCAL', 150, 100), p('CALLE', 230, 100), p('SUCRE', 300, 100),
    p('LOCAL', 40, 125), p('2', 110, 125), p('ESTADO', 140, 125), p('LARA', 220, 125),
    p('QRQRQR', 900, 110), // a la derecha: es el QR, no la dirección
    p('ZONA', 40, 150), p('POSTAL', 100, 150), p('3001', 170, 150),
    p('FECHA', 40, 300), p('XXXXXXXXXXXXXXXXXX', 1000, 300),
  ]);
  assert.deepStrictEqual(r, { direccion: 'CALLE SUCRE LOCAL 2 ESTADO LARA', estado: 'Lara' });
});
caso('OCR sin DOMICILIO', () => assert.strictEqual(domicilioDesdePalabras([p('HOLA', 0, 0)]), null));

console.log(`\n${ok} pruebas correctas`);
