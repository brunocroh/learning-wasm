const bufferMemoria = new ArrayBuffer(256);

const visualizacaoInteira = new Uint8Array(bufferMemoria);
const visPrimeiraMetade = new Uint8Array(bufferMemoria, 0, 128);
const visTerceiroQuarto = new Uint8Array(bufferMemoria, 128, 64);
const visResto = new Uint8Array(bufferMemoria, 192);

const memoria = new ArrayBuffer(9);
const viewIdade = new Uint8Array(memoria, 0, 1);
const viewNome = new Uint8Array(memoria, 1);

const idade = viewIdade[0];

const f64 = new Float64Array(64);
const f32 = new Float32Array(64);

const u32 = new Uint32Array(64);
const u16 = new Uint16Array(64);
const u = new Uint8Array(64);
const pixels = new Uint8ClampedArray(64);

const i32 = new Int32Array(64);
const i16 = new Int16Array(64);
const i8 = new Int8Array(64);

const myArrayBuffer = new ArrayBuffer(256);
const dataView = new DataView(myArrayBuffer);

const cabecalho = dataView.getUint8(0);
const comprimento = dataView.getUint16(1);
const matrizTipada = new Float32Array(comprimento * cabecalho);

for (let i = 0, endreco = 3; i < matrizTipada.length; i++, endereco += 4) {
  matrizTipada[i] = dataView.getFloat(endereco);
}
