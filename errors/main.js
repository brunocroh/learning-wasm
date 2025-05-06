const compileError = () => {
  fetch("invalid-file.wasm")
    .then((response) => response.arrayBuffer())
    .then(function (bytes) {
      const isValid = WebAssembly.validate(bytes);

      console.log(
        `Bytes are ${isValid ? "valid" : "invalid"} for compile it as wasm module`,
      );

      WebAssembly.compile(bytes);
    });
};

// LINK ERROR

const linkError = () => {
  const config = {
    env: {
      // it throw the LinkError
      //the rust coding is expecting this function be console_log, passing a wrong name here I causing a ERROR
      log: (n) => {
        console.log("-> sent: ", n);
      },
    },
  };

  fetch("link.wasm")
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.compile(bytes))
    .then((mod) => WebAssembly.instantiate(mod, config))
    .then((mod) => {
      const { sum_to_n } = mod.exports;

      console.log("<- receive: ", sum_to_n(1)); // 1
      console.log("<- receive: ", sum_to_n(2)); // 3
      console.log("<- receive: ", sum_to_n(3)); // 6
    });
};

const runtimeError = () => {
  WebAssembly.instantiateStreaming(fetch("runtime.wasm")).then(
    ({ instance }) => {
      console.log(instance.exports.fn_runtime_error(0));
      console.log(instance.exports.fn_runtime_error(1));
    },
  );
};

// compileError();
// linkError();
runtimeError();
