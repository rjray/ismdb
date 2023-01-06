use common::enums::{ReferenceTypes, References};
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(References::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(References::Id)
                            .unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(References::Name).string().not_null())
                    .col(ColumnDef::new(References::Language).string())
                    .col(
                        ColumnDef::new(References::ReferenceTypeId)
                            .unsigned()
                            .default(Value::Int(None)),
                    )
                    .col(
                        ColumnDef::new(References::CreatedAt)
                            .date_time()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(References::UpdatedAt)
                            .date_time()
                            .not_null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_reference_referenceType")
                            .from(
                                References::Table,
                                References::ReferenceTypeId,
                            )
                            .to(ReferenceTypes::Table, ReferenceTypes::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(References::Table).to_owned())
            .await
    }
}
