const bufferMemory = new ArrayBuffer(256);

const viewAll = new Uint8Array(bufferMemory);
const viewFirstHalf = new Uint8Array(bufferMemory, 0, 128);
const viewThirdQuarter = new Uint8Array(bufferMemory, 128, 64);
const viewRest = new Uint8Array(bufferMemory, 192);

const memory = new ArrayBuffer(9);
const viewAge = new Uint8Array(memory, 0, 1);
const viewName = new Uint8Array(memory, 1);

const age = viewAge[0];

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

const header = dataView.getUint8(0);
const width = dataView.getUint16(1);
const typedArray = new Float32Array(width * header);

for (let i = 0, address = 3; i < TypedArray.length; i++, address += 4) {
  typedArray[i] = dataView.getFloat(address);
}
