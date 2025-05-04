static TEN: i32 = 10;

#[export_name = "return_ten"]
pub extern "C" fn return_10() -> i32 {
    TEN
}

#[unsafe(no_mangle)]
pub extern "C" fn square(x: i32) -> i32 {
    x * x
}
