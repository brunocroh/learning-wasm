const memory = new WebAssembly.Memory({
  initial: 320,
  maximum: 3200,
  shared: true,
});

const imports = { env: { memory } };

const workers = [];

const cores = window.navigator.hardwareConcurrency;

console.log({ cores });

for (let i = 0; i < cores; i++) {
  let worker = new Worker("/worker.js");

  worker.addEventListener(
    "message",
    (e) => {
      if (e.data.event == "INITIALIZE") {
        workers.push(worker);
      }
    },
    false,
  );

  worker.postMessage({ event: "INITIALIZE", imports });
}

let interval;

const executeWorkers = () => {
  if (workers.length === cores) {
    clearInterval(interval);
  }

  for (let i = 0; i < cores; i++) {
    const v = i + 1;
    console.log(`value to sum: ${v}`);

    workers[i].postMessage({
      event: "EXECUTE",
      value: v,
    });
  }
};

interval = setInterval(executeWorkers, 100);
