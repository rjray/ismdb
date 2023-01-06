pub use sea_orm_migration::prelude::*;

mod m20230102_102224_create_reference_type;
mod m20230102_102241_create_reference;
mod m20230102_102407_create_photo_collection;
mod m20230102_102414_create_publisher;
mod m20230102_102422_create_series;
mod m20230102_102426_create_book;
mod m20230102_102430_create_magazine;
mod m20230102_102442_create_magazine_issue;
mod m20230102_102470_create_magazine_feature;
mod m20230102_102504_create_author;
mod m20230102_102512_create_author_alias;
mod m20230102_102523_create_tag;
mod m20230102_102533_create_feature_tag;
// mod m20230102_102547_create_user;
// mod m20230102_102607_create_auth_scope;
// mod m20230102_102641_create_authors_references;
// mod m20230102_102719_index_authors_references;
mod m20230102_102738_create_tags_references;
mod m20230102_102749_index_tags_references;
mod m20230102_103129_create_feature_tags_magazine_features;
mod m20230102_103228_index_feature_tags_magazine_features;
// mod m20230102_103302_create_users_auth_scopes;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20230102_102224_create_reference_type::Migration),
            Box::new(m20230102_102241_create_reference::Migration),
            Box::new(m20230102_102407_create_photo_collection::Migration),
            Box::new(m20230102_102414_create_publisher::Migration),
            Box::new(m20230102_102422_create_series::Migration),
            Box::new(m20230102_102426_create_book::Migration),
            Box::new(m20230102_102430_create_magazine::Migration),
            Box::new(m20230102_102442_create_magazine_issue::Migration),
            Box::new(m20230102_102470_create_magazine_feature::Migration),
            Box::new(m20230102_102504_create_author::Migration),
            Box::new(m20230102_102512_create_author_alias::Migration),
            Box::new(m20230102_102523_create_tag::Migration),
            Box::new(m20230102_102533_create_feature_tag::Migration),
            // Box::new(m20230102_102547_create_user::Migration),
            // Box::new(m20230102_102607_create_auth_scope::Migration),
            // Box::new(m20230102_102641_create_authors_references::Migration),
            // Box::new(m20230102_102719_index_authors_references::Migration),
            Box::new(m20230102_102738_create_tags_references::Migration),
            Box::new(m20230102_102749_index_tags_references::Migration),
            Box::new(m20230102_103129_create_feature_tags_magazine_features::Migration),
            Box::new(m20230102_103228_index_feature_tags_magazine_features::Migration),
            // Box::new(m20230102_103302_create_users_auth_scopes::Migration),
        ]
    }
}
