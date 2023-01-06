use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_index(
                Index::create()
                    .name("IDX_tags_references_tag")
                    .table(TagsReferences::Table)
                    .if_not_exists()
                    .col(TagsReferences::TagId)
                    .to_owned(),
            )
            .await?;
        manager
            .create_index(
                Index::create()
                    .name("IDX_tags_references_reference")
                    .table(TagsReferences::Table)
                    .if_not_exists()
                    .col(TagsReferences::ReferenceId)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_index(
                Index::drop()
                    .name("IDX_tags_references_tag")
                    .table(TagsReferences::Table)
                    .to_owned(),
            )
            .await?;
        manager
            .drop_index(
                Index::drop()
                    .name("IDX_tags_references_reference")
                    .table(TagsReferences::Table)
                    .to_owned(),
            )
            .await
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
enum TagsReferences {
    Table,
    TagId,
    ReferenceId,
}
