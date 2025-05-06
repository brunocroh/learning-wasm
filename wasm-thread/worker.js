let fnSum;

addEventListener(
  "message",
  async (e) => {
    if (e.data.event === "INITIALIZE") {
      const result = await WebAssembly.instantiateStreaming(
        fetch("./target/wasm32-unknown-unknown/release/wasm_thread.wasm"),
        e.data.imports,
      );

      fnSum = result.instance.exports.sum;
    }

    if (e.data.event === "EXECUTE") {
      const result = fnSum(e.data.value);
      console.log({ result });
    }

    postMessage(e.data);
  },
  false,
);
