use std::fs::File;
use std::io::prelude::*;

#[no_mangle]
pub extern "C" fn aliquot_sum(number: u64) -> u64 {
    if number == 1 || number == 0 {
        return 0;
    }

    let mut sum: u64 = 0;
    for i in 1..(number / 2 + 1) {
        if number % i == 0 {
            sum += i;
        }
    }
    sum
}

fn main() -> std::io::Result<()> {
    let mut file = File::create("/result/file.txt")?;
    file.write_all(b"Result of aliquot sum of 15: ")?;
    file.write_all(aliquot_sum(15).to_string().as_bytes())?;
    file.write_all(b"\n")?;
    file.write_all(b"Result of alitquot sum of 85: ")?;
    file.write_all(aliquot_sum(85).to_string().as_bytes())?;
    Ok(())
}
