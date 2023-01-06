use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(AuthorAliases::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(AuthorAliases::Id)
                            .unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(AuthorAliases::Name).string().not_null(),
                    )
                    .col(ColumnDef::new(AuthorAliases::AuthorId).unsigned())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_authoralias_author")
                            .from(AuthorAliases::Table, AuthorAliases::AuthorId)
                            .to(Authors::Table, Authors::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(AuthorAliases::Table).to_owned())
            .await
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
enum AuthorAliases {
    Table,
    Id,
    Name,
    AuthorId,
}

#[derive(Iden)]
enum Authors {
    Table,
    Id,
}
