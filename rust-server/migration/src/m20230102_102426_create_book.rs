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
                            .integer()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Books::PublisherId).integer())
                    .col(ColumnDef::new(Books::SeriesId).integer())
                    .col(ColumnDef::new(Books::SeriesNumber).string())
                    .col(ColumnDef::new(Books::ISBN).string())
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

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
enum Books {
    Table,
    ReferenceId,
    PublisherId,
    SeriesId,
    SeriesNumber,
    ISBN,
}

#[derive(Iden)]
enum References {
    Table,
    Id,
}

#[derive(Iden)]
enum Publishers {
    Table,
    Id,
}

#[derive(Iden)]
enum Series {
    Table,
    Id,
}