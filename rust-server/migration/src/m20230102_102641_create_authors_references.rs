use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(AuthorsReferences::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(AuthorsReferences::AuthorId)
                            .integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(AuthorsReferences::ReferenceId)
                            .integer()
                            .not_null(),
                    )
                    .primary_key(
                        Index::create()
                            .col(AuthorsReferences::AuthorId)
                            .col(AuthorsReferences::ReferenceId),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_authorsreferences_author")
                            .from(
                                AuthorsReferences::Table,
                                AuthorsReferences::AuthorId,
                            )
                            .to(Authors::Table, Authors::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_authorsreferences_reference")
                            .from(
                                AuthorsReferences::Table,
                                AuthorsReferences::ReferenceId,
                            )
                            .to(References::Table, References::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(
                Table::drop().table(AuthorsReferences::Table).to_owned(),
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

#[derive(Iden)]
enum Authors {
    Table,
    Id,
}

#[derive(Iden)]
enum References {
    Table,
    Id,
}
