const wasmFile = "./target/wasm32-unknown-unknown/release/image_editor.wasm";
const input = document.querySelector("input");
const btnResetFilter = document.querySelector("#remover");
const btnFilterJS = document.querySelector("#preto-e-branco-js");
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

const handleFilter = (image, processImageFn) => {
  const { canvas } = imageToCanvas(image);
  if (!processImageFn) {
    return canvas.ToDataURL();
  }

  if (typeof processImageFn === "function") {
    processImageFn(canvas, canvas.getContext("2d"));
    return canvas.toDataURL("image/jpeg");
  }
};

const addFilter = (text, selector, { instance, filter }) => {
  const button = document.querySelector(selector);
  const image = document.getElementById("imagem");

  button.addEventListener("click", () => {
    handleFilter(image, (canvas, context) => {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const buffer = imageData.data.buffer;
      const u8Array = new Uint8Array(buffer);
      let wasmClampedPtr = instance.exports.malloc(u8Array.length);
      let wasmClampedArray = new Uint8ClampedArray(
        instance.exports.memory.buffer,
        wasmClampedPtr,
        u8Array.length,
      );
      wasmClampedArray.set(u8Array);
      const start = performance.now();
      filter(wasmClampedPtr, u8Array.length);
      const end = performance.now();
      renderPerformance(start, end, text);
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;
      const newImageData = context.createImageData(width, height);
      newImageData.data.set(wasmClampedArray);
      context.putImageData(newImageData, 0, 0);
      image.src = canvas.toDataURL("image/jpeg");
    });
  });
};

WebAssembly.instantiateStreaming(fetch(wasmFile)).then((wasm) => {
  const { instance } = wasm;
  const {
    init_memory,
    memory,
    malloc,
    black_white_filter,
    red_filter,
    green_filter,
    blue_filter,
    opacity_filter,
    invert_colors_filter,
  } = instance.exports;

  addFilter("B/W Filter Wasm", "#preto-e-branco-wasm", {
    instance,
    filter: black_white_filter,
  });

  addFilter("Opacity Filter", "#opacity-filter-wasm", {
    instance,
    filter: opacity_filter,
  });

  addFilter("Invert colors Wasm", "#invert-colors-wasm", {
    instance,
    filter: invert_colors_filter,
  });

  addFilter("Red Filter Wasm", "#red-filter-wasm", {
    instance,
    filter: red_filter,
  });

  addFilter("Green Filter Wasm", "#green-filter-wasm", {
    instance,
    filter: green_filter,
  });

  addFilter("Blue Filter Wasm", "#blue-filter-wasm", {
    instance,
    filter: blue_filter,
  });

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
