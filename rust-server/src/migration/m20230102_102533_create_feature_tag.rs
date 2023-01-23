use common::enums::FeatureTags;
use common::string_fields::FEATURE_TAG_FIELDS;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(FeatureTags::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(FeatureTags::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(FeatureTags::Name)
                            .string_len(
                                *FEATURE_TAG_FIELDS.get("name").unwrap(),
                            )
                            .not_null(),
                    )
                    .col(ColumnDef::new(FeatureTags::Description).string_len(
                        *FEATURE_TAG_FIELDS.get("description").unwrap(),
                    ))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(FeatureTags::Table).to_owned())
            .await
    }
}
