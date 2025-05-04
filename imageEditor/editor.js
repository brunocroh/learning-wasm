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

const imageToCanvas = () => {
  const image = document.getElementById("imagem");
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  canvas.width = width;
  canvas.height = height;

  context.drawImage(image, 0, 0);
  return { canvas, context, width, height };
};

const renderImage = (base64) => {
  const image = document.getElementById("imagem");
  image.src = base64;
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

const BWFilterWasm = (canvas, context) => {
  const dadosDaImagem = context.getImageData(0, 0, canvas.width, canvas.height);

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
  return canvas.toDataURL("image/jpeg");
};

WebAssembly.instantiateStreaming(fetch(wasmFile)).then((wasm) => {
  const { instance } = wasm;
  const { init_memory, memory, malloc, black_white_filter } = instance.exports;

  init_memory();

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

  btnFilterWasm.addEventListener("click", (event) => {
    const { canvas, context, width, height } = imageToCanvas();

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

    const newImage = context.createImageData(width, height);

    newImage.data.set(wasmArray);

    context.putImageData(newImage, 0, 0);
    renderImage(canvas.toDataURL("image/jpeg"));
  });

  btnResetFilter.addEventListener("click", (event) => {
    const imagem = document.getElementById("imagem");
    imagem.src = originalImage;
    console.log("Image restored");
  });

  btnFilterJS.addEventListener("click", (event) => {
    const { canvas, context } = imageToCanvas();
    renderImage(BWFilterJS(canvas, context));
  });
});
