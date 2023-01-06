use common::enums::Magazines;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Magazines::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Magazines::Id)
                            .unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Magazines::Name).string().not_null())
                    .col(ColumnDef::new(Magazines::Language).string())
                    .col(ColumnDef::new(Magazines::Aliases).string())
                    .col(ColumnDef::new(Magazines::Notes).string())
                    .col(
                        ColumnDef::new(Magazines::CreatedAt)
                            .date_time()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Magazines::UpdatedAt)
                            .date_time()
                            .not_null(),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Magazines::Table).to_owned())
            .await
    }
}
