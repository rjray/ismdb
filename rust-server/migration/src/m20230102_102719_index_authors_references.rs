use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_index(
                Index::create()
                    .name("IDX_authors_references_tag")
                    .table(AuthorsReferences::Table)
                    .if_not_exists()
                    .col(AuthorsReferences::AuthorId)
                    .to_owned(),
            )
            .await?;
        manager
            .create_index(
                Index::create()
                    .name("IDX_authors_references_reference")
                    .table(AuthorsReferences::Table)
                    .if_not_exists()
                    .col(AuthorsReferences::ReferenceId)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_index(
                Index::drop()
                    .name("IDX_authors_references_tag")
                    .table(AuthorsReferences::Table)
                    .to_owned(),
            )
            .await?;
        manager
            .drop_index(
                Index::drop()
                    .name("IDX_authors_references_reference")
                    .table(AuthorsReferences::Table)
                    .to_owned(),
            )
            .await
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
enum AuthorsReferences {
    Table,
    AuthorId,
    ReferenceId,
}
