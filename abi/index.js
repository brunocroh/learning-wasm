const wasmFile = "./target/wasm32-unknown-unknown/release/abi.wasm";
const wasmFileLink = "./link.wasm";

WebAssembly.instantiateStreaming(fetch(wasmFile)).then((wasm) => {
  const { instance } = wasm;

  const {
    memory,
    pointer,
    pointer_with_box,
    without_pointer,
    value,
    value_greather_than_i32,
  } = instance.exports;

  const ptrBox = pointer_with_box();
  const ptrBoxValue = new Uint8Array(memory.buffer, ptrBox, 4);
  console.log({ ptrBoxValue });

  const ptr = pointer();
  const ptrValue = new Uint8Array(memory.buffer, ptr, 4);

  console.log({ ptrValue });

  const withoutPointer = without_pointer();

  console.log({ withoutPointer });

  // will throw error, cuzz is out of memory range
  // const withoutPointerValue = new Uint8Array(memory.buffer, withoutPointer, 4);

  console.log("value: ", value());
  console.log("value_greather_than_i32: ", value_greather_than_i32());
});

const imports = {
  env: {
    console_log: (n) => console.log(n),
    alert: (n) => window.alert(n),
  },
};

fetch(wasmFileLink)
  .then((response) => response.arrayBuffer())
  .then((bytes) => WebAssembly.compile(bytes))
  .then((mod) => WebAssembly.instantiate(mod, imports))
  .then(({ exports: { execute } }) => {
    execute();
  });
