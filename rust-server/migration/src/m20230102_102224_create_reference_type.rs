use common::enums::ReferenceTypes;
use common::string_fields::REFERENCE_TYPE_FIELDS;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(ReferenceTypes::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(ReferenceTypes::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(ReferenceTypes::Name)
                            .string_len(
                                *REFERENCE_TYPE_FIELDS.get("name").unwrap(),
                            )
                            .not_null()
                            .unique_key(),
                    )
                    .col(
                        ColumnDef::new(ReferenceTypes::Description).string_len(
                            *REFERENCE_TYPE_FIELDS.get("description").unwrap(),
                        ),
                    )
                    .col(ColumnDef::new(ReferenceTypes::Notes).string_len(
                        *REFERENCE_TYPE_FIELDS.get("notes").unwrap(),
                    ))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(ReferenceTypes::Table).to_owned())
            .await
    }
}
