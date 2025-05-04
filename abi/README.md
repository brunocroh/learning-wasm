## How to compile

first run the code below to create staticlib

```
rustc ./src/numbers.rs --target wasm32-unknown-unknown --crate-type=staticlib
```

later run

```
 rustc ./src/link.rs --target wasm32-unknown-unknown --crate-type=cdylib -L ./
```

important not the -L ./ will make the `rustc` look in the directory to find staticlib
