wat2wasm:
	wat2wasm module-with-fn.wat

wasm2wat:
	wasm2wat sub-div.wasm -o test.wat

validate:
	wasm-validate text.wat

xxd:
	xxd module-with-fn.wasm

obj-dump:
	wasm-objdump -dhxs module-with-fn.wasm

interp:
	wasm-interp --verbose module-with-fn.wasm

interp-exp:
	wasm-interp --run-all-exports --trace module-with-fn.wasm

interp-factorial:
	wasm-interp factorial.wasm --run-export=fatorial --argument=i32:10

decompile:
	wasm-decompile calculator.wasm -o calculator.c

wasm2c:
	wasm2c calculator.wasm -o calculator-c.c

wasm2js:
	wasm2js calculator.wasm -o calculator.mjs

