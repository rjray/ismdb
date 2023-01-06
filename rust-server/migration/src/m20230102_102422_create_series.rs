use common::enums::{Publishers, Series};
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Series::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Series::Id)
                            .unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Series::Name).string().not_null())
                    .col(ColumnDef::new(Series::Notes).string())
                    .col(ColumnDef::new(Series::PublisherId).unsigned())
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_series_publisher")
                            .from(Series::Table, Series::PublisherId)
                            .to(Publishers::Table, Publishers::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Series::Table).to_owned())
            .await
    }
}
