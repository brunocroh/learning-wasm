extern "C" {
    #[link_name = "console_log"]
    fn log(x: f32) -> f32;
}

#[no_mangle]
pub extern "C" fn sum_to_n(n: f32) -> f32 {
    unsafe {
        log(n);
    }
    (n * (n + 1.)) / 2.
}
