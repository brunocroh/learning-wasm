const wasmFile = "./target/wasm32-unknown-unknown/release/image_editor.wasm";
const input = document.querySelector("input");
const btnResetFilter = document.querySelector("#remover");
const btnFilterJS = document.querySelector("#preto-e-branco-js");
const btnFilterWasm = document.querySelector("#preto-e-branco-wasm");
let originalImage = document.getElementById("imagem").src;

const renderPerformance = (start, end, str) => {
  const performance = document.querySelector("#performance");
  performance.textContent = `${str}: ${end - start} ms.`;
};

const imageToCanvas = (image) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;

  context.drawImage(image, 0, 0);
  return { canvas, context };
};

const BWFilterJS = (canvas, context) => {
  const image = context.getImageData(0, 0, canvas.width, canvas.height);

  const pixels = image.data;

  const start = performance.now();

  for (var i = 0, n = pixels.length; i < n; i += 4) {
    const filter = pixels[i] / 3 + pixels[i + 1] / 3 + pixels[i + 2] / 3;
    pixels[i] = filter;
    pixels[i + 1] = filter;
    pixels[i + 2] = filter;
  }
  const end = performance.now();

  renderPerformance(start, end, "Javascript B/W filter");

  context.putImageData(image, 0, 0);
  return canvas.toDataURL("image/jpeg");
};

WebAssembly.instantiateStreaming(fetch(wasmFile)).then((wasm) => {
  const { instance } = wasm;
  const {
    subtract,
    init_memory,
    memory,
    malloc,
    aggregate,
    black_white_filter,
  } = instance.exports;

  init_memory();
  const arrayMemoria = new Uint8Array(memory.buffer, 0).slice(0, 10);

  console.log(arrayMemoria);
  console.log(subtract(28, 10));

  const jsLista = Uint8Array.from([20, 50, 80]);
  const comprimento = jsLista.length;
  const wasmListaPonteiro = malloc(comprimento);

  const wasmLista = new Uint8Array(
    memory.buffer,
    wasmListaPonteiro,
    comprimento,
  );

  wasmLista.set(jsLista);

  const aggregateResult = aggregate(wasmListaPonteiro, comprimento);

  console.log({ aggregateResult });

  btnFilterWasm.addEventListener("click", (event) => {
    const image = document.getElementById("imagem");
    const { canvas, context } = imageToCanvas(image);

    const dadosDaImagem = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const buffer = dadosDaImagem.data.buffer;
    const u8Array = new Uint8Array(buffer);
    const ponteiro = malloc(u8Array.length);

    const wasmArray = new Uint8ClampedArray(
      instance.exports.memory.buffer,
      ponteiro,
      u8Array.length,
    );

    wasmArray.set(u8Array);

    const start = performance.now();
    black_white_filter(ponteiro, u8Array.length);
    const end = performance.now();

    renderPerformance(start, end, "WebAssembly B/W filter");

    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;

    const newImage = context.createImageData(width, height);

    newImage.data.set(wasmArray);

    context.putImageData(newImage, 0, 0);
    image.src = canvas.toDataURL("image/jpeg");
  });

  input.addEventListener("change", (event) => {
    const imageFile = event.target.files[0];
    const reader = new FileReader();

    const imagem = document.getElementById("imagem");
    imagem.title = imageFile.name;

    reader.onload = (event) => {
      imagem.src = event.target.result;
      originalImage = imagem.src;
    };

    reader.readAsDataURL(imageFile);
  });

  btnResetFilter.addEventListener("click", (event) => {
    const imagem = document.getElementById("imagem");
    imagem.src = originalImage;
    console.log("Image restored");
  });

  btnFilterJS.addEventListener("click", (event) => {
    const image = document.getElementById("imagem");
    const { canvas, context } = imageToCanvas(image);
    const base64 = BWFilterJS(canvas, context);
    image.src = base64;
  });
});
