use common::enums::Publishers;
use common::string_fields::PUBLISHER_FIELDS;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Publishers::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Publishers::Id)
                            .unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Publishers::Name)
                            .string_len(*PUBLISHER_FIELDS.get("name").unwrap())
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Publishers::Notes).string_len(
                            *PUBLISHER_FIELDS.get("notes").unwrap(),
                        ),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Publishers::Table).to_owned())
            .await
    }
}
