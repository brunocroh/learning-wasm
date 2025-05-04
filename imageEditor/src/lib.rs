use std::alloc::{Layout, alloc};
use std::mem;
use std::slice::from_raw_parts_mut;

#[unsafe(no_mangle)]
extern "C" fn black_white_filter(pointer: *mut u8, length: usize) {
    let pixels = unsafe { from_raw_parts_mut(pointer as *mut u8, length) };
    let mut i = 0;
    loop {
        if i >= length - 1 {
            break;
        }

        let filter = (pixels[i] / 3) + (pixels[i + 1] / 3) + (pixels[i + 2] / 3);
        pixels[i] = filter;
        pixels[i + 1] = filter;
        pixels[i + 2] = filter;
        i += 4;
    }
}

#[unsafe(no_mangle)]
extern "C" fn malloc(length: usize) -> *mut u8 {
    let align = mem::align_of::<usize>();
    if let Ok(layout) = Layout::from_size_align(length, align) {
        unsafe {
            if layout.size() > 0 {
                let pointer = alloc(layout);
                if !pointer.is_null() {
                    return pointer;
                }
            } else {
                return align as *mut u8;
            }
        }
    }
    std::process::abort()
}

#[unsafe(no_mangle)]
extern "C" fn init_memory() {
    let fatia: &mut [u8];

    unsafe { fatia = from_raw_parts_mut::<u8>(5 as *mut u8, 10) }

    fatia[0] = 85
}
