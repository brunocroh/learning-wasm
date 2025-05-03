const arquivo = "./target/wasm32-unknown-unknown/release/image_editor.wasm";

const tempoDaOperacao = (inicio, fim, nomeDaOperacao) => {
  const performance = document.querySelector("#performance");

  performance.textContent = `${nomeDaOperacao}: ${fim - inicio} ms.`;
};

const converteImagemParaCanvas = (imagem) => {
  const canvas = document.createElement("canvas");

  const contexto = canvas.getContext("2d");

  canvas.width = imagem.naturalWidth || imagem.width;
  canvas.height = imagem.naturalHeight || imagem.height;

  contexto.drawImage(imagem, 0, 0);
  return { canvas, contexto };
};

const filtroPretoBrancoJS = (canvas, contexto) => {
  const dadosDaImagem = contexto.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const pixels = dadosDaImagem.data;

  const inicio = performance.now();
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    const filtro = pixels[i] / 3 + pixels[i + 1] / 3 + pixels[i + 2] / 3;
    pixels[i] = filtro;
    pixels[i + 1] = filtro;
    pixels[i + 2] = filtro;
  }
  const fim = performance.now();

  tempoDaOperacao(inicio, fim, "Javascript Preto e Branco");

  contexto.putImageData(dadosDaImagem, 0, 0);
  return canvas.toDataURL("image/jpeg");
};

WebAssembly.instantiateStreaming(fetch(arquivo)).then((wasm) => {
  const { instance } = wasm;
  const {
    subtracao,
    criar_memoria_inicial,
    memory,
    malloc,
    acumular,
    filtro_preto_e_branco,
  } = instance.exports;

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

  botaoPBFiltroWasm.addEventListener("click", (event) => {
    const imagem = document.getElementById("imagem");
    const { canvas, contexto } = converteImagemParaCanvas(imagem);

    const dadosDaImagem = contexto.getImageData(
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

    const inicio = performance.now();

    filtro_preto_e_branco(ponteiro, u8Array.length);

    const final = performance.now();

    tempoDaOperacao(inicio, final, "WebAssembly Preto e Branco");

    const width = imagem.naturalWidth || imagem.width;
    const height = imagem.naturalHeight || imagem.height;

    const novosDadosDaImagem = contexto.createImageData(width, height);

    novosDadosDaImagem.data.set(wasmArray);

    contexto.putImageData(novosDadosDaImagem, 0, 0);
    imagem.src = canvas.toDataURL("image/jpeg");
  });
});

const input = document.querySelector("input");
const botaoResetarFiltro = document.querySelector("#remover");
const botaoPBFiltroJs = document.querySelector("#preto-e-branco-js");
const botaoPBFiltroWasm = document.querySelector("#preto-e-branco-wasm");

let imagemOriginal = document.getElementById("imagem").src;

input.addEventListener("change", (event) => {
  const imageFile = event.target.files[0];
  const reader = new FileReader();

  const imagem = document.getElementById("imagem");
  imagem.title = arquivo.name;

  reader.onload = (event) => {
    imagem.src = event.target.result;
    imagemOriginal = imagem.src;
  };

  reader.readAsDataURL(imageFile);
});

botaoResetarFiltro.addEventListener("click", (event) => {
  const imagem = document.getElementById("imagem");
  imagem.src = imagemOriginal;
  console.log("Image restored");
});

botaoPBFiltroJs.addEventListener("click", (event) => {
  const imagem = document.getElementById("imagem");
  const { canvas, contexto } = converteImagemParaCanvas(imagem);
  const base64 = filtroPretoBrancoJS(canvas, contexto);
  imagem.src = base64;
});
