use crate::utils::{to_bool_opt, to_string_opt, to_string_vec, to_unix_seconds_opt};
use core_foundation::{
    base::{CFRelease, CFTypeRef, TCFType},
    string::CFString,
};
use serde::Serialize;
use std::{error::Error, ffi::c_void, path::Path, ptr};

type MDItemRef = *mut c_void;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MdItemUserTag {
    pub name: String,
    pub color_index: Option<u8>,
}

impl MdItemUserTag {
    fn from_raw(raw: String) -> Self {
        let parts: Vec<&str> = raw.split('\n').collect();
        let name = parts.first().unwrap().trim().to_string();
        let color_index = parts.last().unwrap().parse::<u8>().ok();

        MdItemUserTag { name, color_index }
    }
}

#[derive(Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MdItemAttrs {
    pub user_tags: Vec<MdItemUserTag>,
    pub attribute_change_date: Option<u64>,
    pub content_creation_date: Option<u64>,
    pub content_modification_date: Option<u64>,
    pub content_type: Option<String>,
    pub finder_comment: Option<String>,
    pub kind: Option<String>,
    pub last_used_date: Option<u64>,
    pub fs_content_change_date: Option<u64>,
    pub fs_creation_date: Option<u64>,
    pub fs_invisible: Option<bool>,
}

#[link(name = "CoreServices", kind = "framework")]
unsafe extern "C" {
    fn MDItemCreate(alloc: *const c_void, path: CFTypeRef) -> MDItemRef;
    fn MDItemCopyAttribute(item: MDItemRef, name: *const c_void) -> CFTypeRef;

    static _kMDItemUserTags: *const c_void;

    static kMDItemAttributeChangeDate: *const c_void;
    static kMDItemContentCreationDate: *const c_void;
    static kMDItemContentModificationDate: *const c_void;
    static kMDItemContentType: *const c_void;
    static kMDItemFinderComment: *const c_void;
    static kMDItemKind: *const c_void;
    static kMDItemLastUsedDate: *const c_void;
    static kMDItemFSContentChangeDate: *const c_void;
    static kMDItemFSCreationDate: *const c_void;
    static kMDItemFSInvisible: *const c_void;
}

enum AttrKind<'a> {
    VecString(&'a mut Vec<String>),
    String(fn(&mut MdItemAttrs) -> &mut Option<String>),
    Date(fn(&mut MdItemAttrs) -> &mut Option<u64>),
    Bool(fn(&mut MdItemAttrs) -> &mut Option<bool>),
}

struct AttrSpec<'a> {
    key: *const c_void,
    kind: AttrKind<'a>,
}

impl<'a> AttrSpec<'a> {
    fn vec_string(key: *const c_void, target: &'a mut Vec<String>) -> Self {
        Self {
            key,
            kind: AttrKind::VecString(target),
        }
    }

    fn string(key: *const c_void, accessor: fn(&mut MdItemAttrs) -> &mut Option<String>) -> Self {
        Self {
            key,
            kind: AttrKind::String(accessor),
        }
    }

    fn date(key: *const c_void, accessor: fn(&mut MdItemAttrs) -> &mut Option<u64>) -> Self {
        Self {
            key,
            kind: AttrKind::Date(accessor),
        }
    }

    fn bool(key: *const c_void, accessor: fn(&mut MdItemAttrs) -> &mut Option<bool>) -> Self {
        Self {
            key,
            kind: AttrKind::Bool(accessor),
        }
    }

    unsafe fn apply(&mut self, value_ref: CFTypeRef, attrs: &mut MdItemAttrs) {
        match &mut self.kind {
            AttrKind::VecString(target) => {
                **target = to_string_vec(value_ref);
            }
            AttrKind::String(accessor) => {
                *accessor(attrs) = to_string_opt(value_ref);
            }
            AttrKind::Date(accessor) => {
                *accessor(attrs) = to_unix_seconds_opt(value_ref);
            }
            AttrKind::Bool(accessor) => {
                *accessor(attrs) = to_bool_opt(value_ref);
            }
        }
    }
}

pub fn fetch_attrs(path: &Path) -> Result<MdItemAttrs, Box<dyn Error>> {
    let cf_path = CFString::new(&path.to_string_lossy());

    unsafe {
        let item = MDItemCreate(ptr::null(), cf_path.as_CFTypeRef());
        if item.is_null() {
            return Ok(MdItemAttrs::default());
        }

        let mut raw_user_tags: Vec<String> = Vec::new();
        let mut attrs = MdItemAttrs::default();

        {
            let mut attr_specs = [
                AttrSpec::vec_string(_kMDItemUserTags, &mut raw_user_tags),
                AttrSpec::date(kMDItemAttributeChangeDate, |attrs| {
                    &mut attrs.attribute_change_date
                }),
                AttrSpec::date(kMDItemContentCreationDate, |attrs| {
                    &mut attrs.content_creation_date
                }),
                AttrSpec::date(kMDItemContentModificationDate, |attrs| {
                    &mut attrs.content_modification_date
                }),
                AttrSpec::string(kMDItemContentType, |attrs| &mut attrs.content_type),
                AttrSpec::string(kMDItemFinderComment, |attrs| &mut attrs.finder_comment),
                AttrSpec::string(kMDItemKind, |attrs| &mut attrs.kind),
                AttrSpec::date(kMDItemLastUsedDate, |attrs| &mut attrs.last_used_date),
                AttrSpec::date(kMDItemFSContentChangeDate, |attrs| {
                    &mut attrs.fs_content_change_date
                }),
                AttrSpec::date(kMDItemFSCreationDate, |attrs| &mut attrs.fs_creation_date),
                AttrSpec::bool(kMDItemFSInvisible, |attrs| &mut attrs.fs_invisible),
            ];

            for spec in attr_specs.iter_mut() {
                let value_ref = MDItemCopyAttribute(item, spec.key);

                if value_ref.is_null() {
                    continue;
                }

                spec.apply(value_ref, &mut attrs);

                CFRelease(value_ref);
            }
        }

        attrs.user_tags = raw_user_tags
            .into_iter()
            .map(MdItemUserTag::from_raw)
            .collect();

        CFRelease(item as _);

        Ok(attrs)
    }
}
