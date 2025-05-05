let fnSum;

addEventListener("message", async (e) => {
  if (e.data.event === "INITIALIZE") {
    result = await WebAssembly.instantiateStreaming(
      fetch("./target/wasm32-unknown-unknown/release/wasm_thread.wasm"),
    );
  }
});
