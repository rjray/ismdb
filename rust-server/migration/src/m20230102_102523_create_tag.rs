use common::enums::Tags;
use common::string_fields::TAG_FIELDS;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Tags::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Tags::Id)
                            .unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Tags::Name)
                            .string_len(*TAG_FIELDS.get("name").unwrap())
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Tags::Type)
                            .string_len(*TAG_FIELDS.get("type").unwrap()),
                    )
                    .col(
                        ColumnDef::new(Tags::Description).string_len(
                            *TAG_FIELDS.get("description").unwrap(),
                        ),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Tags::Table).to_owned())
            .await
    }
}
