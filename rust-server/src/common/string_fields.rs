use phf::phf_map;

pub static AUTH_SCOPE_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "description" => 100,
    "name" => 50,
};

pub static AUTHOR_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "name" => 60,
};

pub static AUTHOR_ALIAS_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "name" => 60,
};

pub static BOOK_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "isbn" => 15,
    "series_number" => 10,
};

pub static FEATURE_TAG_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "description" => 255,
    "name" => 25,
};

pub static MAGAZINE_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "aliases" => 100,
    "language" => 50,
    "name" => 50,
    "notes" => 500,
};

pub static MAGAZINE_ISSUE_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "issue" => 50,
};

pub static PHOTO_COLLECTION_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "location" => 255,
    "media" => 50,
};

pub static PUBLISHER_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "name" => 50,
    "notes" => 500,
};

pub static REFERENCE_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "language" => 50,
    "name" => 255,
};

pub static REFERENCE_TYPE_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "description" => 50,
    "name" => 25,
    "notes" => 255,
};

pub static SERIES_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "name" => 50,
    "notes" => 500,
};

pub static TAG_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "description" => 255,
    "name" => 75,
    "type" => 25,
};

pub static USER_FIELDS: phf::Map<&'static str, u32> = phf_map! {
    "email" => 50,
    "name" => 75,
    "password" => 60,
    "username" => 25,
};
