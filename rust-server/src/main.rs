mod cli_parser;

fn main() {
    let args = cli_parser::get_parser().get_matches();
    println!("{:?}", args);

    println!("Hello, world!");
}
