use core::slice::from_raw_parts_mut;

#[unsafe(no_mangle)]
fn sum(value: u8) -> u8 {
    let slice: &mut [u8] = unsafe { from_raw_parts_mut(5 as *mut u8, 255) };

    slice[0] = slice[0] + value;
    slice[0]
}
