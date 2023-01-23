use common::enums::Authors;
use common::string_fields::AUTHOR_FIELDS;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Authors::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Authors::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Authors::Name)
                            .string_len(*AUTHOR_FIELDS.get("name").unwrap())
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Authors::CreatedAt)
                            .date_time()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Authors::UpdatedAt)
                            .date_time()
                            .not_null(),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Authors::Table).to_owned())
            .await
    }
}
