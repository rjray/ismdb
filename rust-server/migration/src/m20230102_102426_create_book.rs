use common::enums::{Books, Publishers, References, Series};
use common::string_fields::BOOK_FIELDS;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Books::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Books::ReferenceId)
                            .unsigned()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Books::PublisherId).unsigned())
                    .col(ColumnDef::new(Books::SeriesId).unsigned())
                    .col(
                        ColumnDef::new(Books::SeriesNumber).string_len(
                            *BOOK_FIELDS.get("series_number").unwrap(),
                        ),
                    )
                    .col(
                        ColumnDef::new(Books::ISBN)
                            .string_len(*BOOK_FIELDS.get("isbn").unwrap()),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_book_reference")
                            .from(Books::Table, Books::ReferenceId)
                            .to(References::Table, References::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_book_publisher")
                            .from(Books::Table, Books::PublisherId)
                            .to(Publishers::Table, Publishers::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_book_series")
                            .from(Books::Table, Books::SeriesId)
                            .to(Series::Table, Series::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Books::Table).to_owned())
            .await
    }
}
