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

const throwingExceptions = () => {
  const tag = new WebAssembly.Tag({
    parameters: ["f32"],
  });

  const exceptionOption = { traceStack: true };

  const config = {
    env: {
      throw_exception: () => {
        console.log("here");
        const exc = new WebAssembly.Exception(tag, [85.25], exceptionOption);
        throw exc;
      },
    },
  };

  fetch("exception.wasm")
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.compile(bytes))
    .then((mod) => WebAssembly.instantiate(mod, config))
    .then((mod) => mod.exports.exception())
    .catch((e) => {
      console.error(e);

      if (e.is(tag)) {
        console.log(`getArg 0 : ${e.getArg(tag, 0)}`);
      }
    });
};

// compileError();
// linkError();
// runtimeError();
throwingExceptions();
