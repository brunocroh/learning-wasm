mod link;
mod numbers;

#[unsafe(no_mangle)]
extern "C" fn pointer_with_box() -> *const [u8; 4] {
    Box::into_raw(Box::new([8, 5, 8, 5]))
}

#[unsafe(no_mangle)]
extern "C" fn pointer() -> *const u8 {
    [8, 5, 8, 5].as_ptr()
}

#[unsafe(no_mangle)]
fn without_pointer() -> [u8; 4] {
    [8, 5, 8, 5]
}

#[unsafe(no_mangle)]
fn value() -> u8 {
    85
}

#[unsafe(no_mangle)]
fn value_greather_than_i32() -> [u8; 33] {
    *b"Bem-vindo ao mundo do WebAssembly"
}
