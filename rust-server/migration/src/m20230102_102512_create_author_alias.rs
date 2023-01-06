use common::enums::{AuthorAliases, Authors};
use common::string_fields::AUTHOR_ALIAS_FIELDS;
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
                        ColumnDef::new(AuthorAliases::Name)
                            .string_len(
                                *AUTHOR_ALIAS_FIELDS.get("name").unwrap(),
                            )
                            .not_null(),
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
