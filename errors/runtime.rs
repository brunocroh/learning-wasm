#[no_mangle]
pub fn fn_runtime_error(n: u8) -> u8 {
    // it will throw a error if number grather than 0 cuzz u8 max value is 255
    n + 255
}
