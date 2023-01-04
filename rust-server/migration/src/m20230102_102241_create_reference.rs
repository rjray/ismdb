use sea_orm_migration::prelude::*;
// use common::enums::{ReferenceTypes, References};

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
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(References::Name).string().not_null())
                    .col(ColumnDef::new(References::Language).string())
                    .col(
                        ColumnDef::new(References::ReferenceTypeId)
                            .integer()
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

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
enum References {
    #[iden = "References"]
    Table,
    Id,
    Name,
    Language,
    #[iden = "referenceTypeId"]
    ReferenceTypeId,
    #[iden = "createdAt"]
    CreatedAt,
    #[iden = "updatedAt"]
    UpdatedAt,
}

#[derive(Iden)]
enum ReferenceTypes {
    #[iden = "ReferenceTypes"]
    Table,
    Id,
}
