extern "C" {
    #[link_name = "throw_exception"]
    fn throw_exception_js();
}

#[unsafe(no_mangle)]
pub extern "C" fn exception() {
    unsafe {
        throw_exception_js();
    }
}
