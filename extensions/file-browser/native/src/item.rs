use crate::mditem::{self, MdItemAttrs};
use crate::utils::is_dotfile;
use serde::Serialize;
use std::{
    cmp::Ordering,
    error::Error,
    fs,
    path::{Path, PathBuf},
};

#[derive(Clone, Copy)]
pub enum SortMode {
    NameAsc,
    KindAsc,
    LastOpenedAsc,
    AddedAsc,
    ModifiedAsc,
    CreatedAsc,
    SizeAsc,
    TagsAsc,
}

impl SortMode {
    pub fn from_str(value: &str) -> Option<Self> {
        match value {
            "name-asc" => Some(Self::NameAsc),
            "kind-asc" => Some(Self::KindAsc),
            "last-opened-asc" => Some(Self::LastOpenedAsc),
            "added-asc" => Some(Self::AddedAsc),
            "modified-asc" => Some(Self::ModifiedAsc),
            "created-asc" => Some(Self::CreatedAsc),
            "size-asc" => Some(Self::SizeAsc),
            "tags-asc" => Some(Self::TagsAsc),
            _ => None,
        }
    }
}

impl Default for SortMode {
    fn default() -> Self {
        Self::NameAsc
    }
}

#[derive(Serialize)]
pub struct Item {
    #[serde(rename = "type")]
    typ: String,
    name: String,
    path: String,
    size: u64,
    #[serde(flatten)]
    md_attrs: MdItemAttrs,
}

pub struct ReadDirOptions {
    pub skip_dotfiles: bool,
    pub sort_directories_first: bool,
    pub sort_mode: SortMode,
}

impl Default for ReadDirOptions {
    fn default() -> Self {
        Self {
            skip_dotfiles: true,
            sort_directories_first: true,
            sort_mode: SortMode::default(),
        }
    }
}

pub fn read_dir_items(dir: &Path, options: &ReadDirOptions) -> Result<Vec<Item>, Box<dyn Error>> {
    let entries: Vec<PathBuf> = fs::read_dir(dir)
        .map_err(|e| format!("read_dir failed: {}: {e}", dir.display()))?
        .filter_map(|e| e.ok().map(|x| x.path()))
        .filter(|path| !(options.skip_dotfiles && is_dotfile(path)))
        .collect();

    let mut out = Vec::with_capacity(entries.len());
    for p in entries {
        if let Ok(it) = stat_and_mditems(&p) {
            out.push(it);
        }
    }

    out.sort_by(|a, b| {
        if options.sort_directories_first {
            let a_is_dir = a.typ == "directory";
            let b_is_dir = b.typ == "directory";

            match (a_is_dir, b_is_dir) {
                (true, false) => Ordering::Less,
                (false, true) => Ordering::Greater,
                _ => compare_items(a, b, options.sort_mode),
            }
        } else {
            compare_items(a, b, options.sort_mode)
        }
    });

    Ok(out)
}

fn compare_items(a: &Item, b: &Item, mode: SortMode) -> Ordering {
    match mode {
        SortMode::NameAsc => compare_strings(Some(&a.name), Some(&b.name)),
        SortMode::KindAsc => {
            compare_strings(a.md_attrs.kind.as_deref(), b.md_attrs.kind.as_deref())
        }
        SortMode::LastOpenedAsc => {
            compare_numbers(a.md_attrs.last_used_date, b.md_attrs.last_used_date)
        }
        SortMode::AddedAsc => compare_numbers(date_added_value(a), date_added_value(b)),
        SortMode::ModifiedAsc => compare_numbers(
            a.md_attrs.content_modification_date,
            b.md_attrs.content_modification_date,
        ),
        SortMode::CreatedAsc => {
            compare_numbers(a.md_attrs.fs_creation_date, b.md_attrs.fs_creation_date)
        }
        SortMode::SizeAsc => a.size.cmp(&b.size),
        SortMode::TagsAsc => compare_strings(
            Some(&tags_sort_key(&a.md_attrs.user_tags)),
            Some(&tags_sort_key(&b.md_attrs.user_tags)),
        ),
    }
    .then_with(|| a.name.cmp(&b.name))
}

fn compare_strings(left: Option<&str>, right: Option<&str>) -> Ordering {
    match (left, right) {
        (Some(l), Some(r)) => l.to_lowercase().cmp(&r.to_lowercase()),
        (Some(_), None) => Ordering::Less,
        (None, Some(_)) => Ordering::Greater,
        (None, None) => Ordering::Equal,
    }
}

fn compare_numbers(left: Option<u64>, right: Option<u64>) -> Ordering {
    match (left, right) {
        (Some(l), Some(r)) => l.cmp(&r),
        (Some(_), None) => Ordering::Less,
        (None, Some(_)) => Ordering::Greater,
        (None, None) => Ordering::Equal,
    }
}

fn date_added_value(item: &Item) -> Option<u64> {
    item.md_attrs
        .fs_content_change_date
        .or(item.md_attrs.fs_creation_date)
}

fn tags_sort_key(tags: &[crate::mditem::MdItemUserTag]) -> String {
    if tags.is_empty() {
        return "\u{ffff}".to_string();
    }

    tags.iter()
        .map(|tag| tag.name.as_str())
        .collect::<Vec<&str>>()
        .join("\u{0}")
}

fn stat_and_mditems(path: &Path) -> Result<Item, Box<dyn Error>> {
    let md = fs::symlink_metadata(path)
        .map_err(|e| format!("symlink_metadata failed: {}: {e}", path.display()))?;

    let typ = {
        let ft = md.file_type();
        if ft.is_dir() {
            "directory"
        } else if ft.is_symlink() {
            "symlink"
        } else if ft.is_file() {
            "file"
        } else {
            "other"
        }
        .to_string()
    };

    let name = path
        .file_name()
        .map(|s| s.to_string_lossy().into_owned())
        .unwrap_or_else(|| path.to_string_lossy().into_owned());

    let attrs = mditem::fetch_attrs(path)?;

    Ok(Item {
        name,
        typ,
        path: path.to_string_lossy().into_owned(),
        size: md.len(),
        md_attrs: attrs,
    })
}
