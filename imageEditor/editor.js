const arquivo = "./target/wasm32-unknown-unknown/release/image_editor.wasm";

WebAssembly.instantiateStreaming(fetch(arquivo)).then((wasm) => {
  const { instance } = wasm;
  const { subtracao, criar_memoria_inicial, memory, malloc, acumular } =
    instance.exports;

  criar_memoria_inicial();
  const arrayMemoria = new Uint8Array(memory.buffer, 0).slice(0, 10);

  console.log(arrayMemoria);
  console.log(subtracao(28, 10));

  const jsLista = Uint8Array.from([20, 50, 80]);
  const comprimento = jsLista.length;
  const wasmListaPonteiro = malloc(comprimento);

  const wasmLista = new Uint8Array(
    memory.buffer,
    wasmListaPonteiro,
    comprimento,
  );

  wasmLista.set(jsLista);

  const somaEntreItensDaLista = acumular(wasmListaPonteiro, comprimento);

  console.log({ somaEntreItensDaLista });
});
