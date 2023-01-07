use common::enums::Users;
use common::string_fields::USER_FIELDS;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Users::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Users::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Users::Name)
                            .string_len(*USER_FIELDS.get("name").unwrap())
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Users::Email)
                            .string_len(*USER_FIELDS.get("email").unwrap())
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Users::Username)
                            .string_len(*USER_FIELDS.get("username").unwrap())
                            .not_null()
                            .unique_key(),
                    )
                    .col(
                        ColumnDef::new(Users::Password)
                            .string_len(*USER_FIELDS.get("password").unwrap())
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Users::CreatedAt).date_time().not_null(),
                    )
                    .col(
                        ColumnDef::new(Users::UpdatedAt).date_time().not_null(),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Users::Table).to_owned())
            .await
    }
}
