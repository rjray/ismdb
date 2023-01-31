/*
    Define the clap::Command object that is used by ismdb for argument parsing.
*/

use std::path::PathBuf;

use clap::{command, value_parser, Arg, ArgAction, Command};

fn get_database_cmd() -> Command {
    Command::new("database")
        .about("Run database commands")
        .subcommand(Command::new("init").about("Initialize the database"))
        .subcommand(Command::new("update").about("Apply new database code"))
}

fn get_server_cmd() -> Command {
    Command::new("server")
        .about("Run the server")
        .arg(
            Arg::new("host")
                .required(false)
                .short('H')
                .long("host")
                .env("ISMDB_HOST")
                .action(ArgAction::Set)
                .default_value("localhost")
                .help("Specify the host or IP to bind to"),
        )
        .arg(
            Arg::new("port")
                .required(false)
                .short('p')
                .long("port")
                .env("ISMDB_PORT")
                .action(ArgAction::Set)
                .default_value("80")
                .help("Specify the port to use"),
        )
}

pub fn get_parser() -> Command {
    command!()
        .arg(
            Arg::new("debug")
                .required(false)
                .short('d')
                .long("debug")
                .action(ArgAction::Count)
                .help("Turn on debugging (may be passed multiple times)"),
        )
        .arg(
            Arg::new("database")
                .required(true)
                .short('D')
                .long("database")
                .env("ISMDB_DATABASE")
                .value_parser(value_parser!(PathBuf))
                .help("Path to database file"),
        )
        .subcommand(get_database_cmd())
        .subcommand(get_server_cmd())
}
