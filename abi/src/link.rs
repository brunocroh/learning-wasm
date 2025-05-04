extern "C" {
    #[link_name = "console_log"]
    fn log(x: i32) -> i32;

    #[link_name = "alert"]
    fn alert(x: i8) -> i8;
}

#[link(name = "numbers", kind = "static")]
extern "C" {
    fn return_ten() -> i32;
    fn square(x: i32) -> i32;
}

#[unsafe(no_mangle)]
pub fn execute() {
    unsafe {
        let ten = return_ten();

        log(20);
        log(87654321);

        log(ten);
        log(square(ten));

        alert(85);
    }
}
