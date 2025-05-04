extern crate core;

use core::slice::from_raw_parts_mut;

fn my_book() -> String {
    String::from(
        "Na planície avermelhada os juazeiros alargavam duas manchas verdes. Os infelizes tinham caminhado o dia inteiro, estavam cansados e famintos. Ordinariamente andavam pouco, mas como haviam repousado bastante na areia do rio seco, a viagem progredira bem três léguas. Fazia horas que procuravam uma sombra. A folhagem dos juazeiros apareceu longe, através dos galhos pelados da catinga rala. Arrastaram-se para lá, devagar, sinhá Vitória com o filho mais novo escanchado no quarto e o baú de folha na cabeça, Fabiano sombrio, cambaio, o aió a tiracolo, a cuia pendurada numa correia presa ao cinturão, a espingarda de pederneira no ombro. O menino mais velho e a cachorra Baleia iam atrás.",
    )
}

#[unsafe(no_mangle)]
pub extern "C" fn save_book_memory() {
    let slice_memory: &mut [u8];

    let book: String = my_book();
    let bytes: &[u8] = book.as_bytes();

    unsafe { slice_memory = from_raw_parts_mut::<u8>(1 as *mut u8, bytes.len()) }

    for pos in 0..bytes.len() {
        slice_memory[pos] = bytes[pos];
    }
}
