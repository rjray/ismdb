use common::enums::AuthScopes;
use common::string_fields::AUTH_SCOPE_FIELDS;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(AuthScopes::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(AuthScopes::Id)
                            .unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(AuthScopes::Name)
                            .string_len(*AUTH_SCOPE_FIELDS.get("name").unwrap())
                            .not_null()
                            .unique_key(),
                    )
                    .col(ColumnDef::new(AuthScopes::Description).string_len(
                        *AUTH_SCOPE_FIELDS.get("description").unwrap(),
                    ))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(AuthScopes::Table).to_owned())
            .await
    }
}
