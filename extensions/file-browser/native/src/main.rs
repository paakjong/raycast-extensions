mod item;
mod mditem;
mod utils;

use std::{env, error::Error, path::Path};

fn main() -> Result<(), Box<dyn Error>> {
    let mut args = env::args().skip(1);
    let dir = args
        .next()
        .ok_or("Usage: mditems <directory> [--skip-dotfiles]")?;

    let mut options = item::ReadDirOptions::default();
    while let Some(arg) = args.next() {
        match arg.as_str() {
            "--skip-dotfiles" => options.skip_dotfiles = true,
            "--sort" => {
                let sort_value = args
                    .next()
                    .ok_or("Missing value for --sort (expected sort mode identifier)")?;
                options.sort_mode = item::SortMode::from_str(&sort_value)
                    .ok_or_else(|| format!("Unknown sort mode: {sort_value}"))?;
            }
            _ => return Err(format!("Unknown option: {arg}").into()),
        }
    }

    let items = item::read_dir_items(Path::new(&dir), &options)?;
    println!("{}", serde_json::to_string(&items)?);
    Ok(())
}
