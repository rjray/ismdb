use common::enums::Magazines;
use common::string_fields::MAGAZINE_FIELDS;
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
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Magazines::Name)
                            .string_len(*MAGAZINE_FIELDS.get("name").unwrap())
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Magazines::Language).string_len(
                            *MAGAZINE_FIELDS.get("language").unwrap(),
                        ),
                    )
                    .col(
                        ColumnDef::new(Magazines::Aliases).string_len(
                            *MAGAZINE_FIELDS.get("aliases").unwrap(),
                        ),
                    )
                    .col(
                        ColumnDef::new(Magazines::Notes)
                            .string_len(*MAGAZINE_FIELDS.get("notes").unwrap()),
                    )
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
