#[no_mangle]
fn validate_anagram(s: &str, t: &str) -> bool {
    let mut s = s.to_ascii_lowercase().chars().collect::<Vec<_>>();
    let mut t = t.to_ascii_lowercase().chars().collect::<Vec<_>>();
    s.sort_unstable();
    t.sort_unstable();
    s == t
}

fn main() {
    println!("{}", validate_anagram("amor", "ramo"));
    println!("{}", validate_anagram("mora", "roma"));
    println!("{}", validate_anagram("marcia", "paulo"));
}
