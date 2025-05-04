WebAssembly.instantiateStreaming(fetch("./book.wasm")).then((wasm) => {
  const { instance } = wasm;
  const { save_book_memory, memory } = instance.exports;

  save_book_memory();

  const _memory = new Uint8Array(memory.buffer, 0, 700);

  const decoder = new TextDecoder();
  const text = decoder.decode(_memory);

  const content = document.querySelector("#conteudo");

  content.textContent = text;
});
