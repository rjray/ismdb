use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(PhotoCollection::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(PhotoCollection::ReferenceId)
                            .integer()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(PhotoCollection::Location)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(PhotoCollection::Media)
                            .string()
                            .not_null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_photocollection_reference")
                            .from(
                                PhotoCollection::Table,
                                PhotoCollection::ReferenceId,
                            )
                            .to(References::Table, References::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(PhotoCollection::Table).to_owned())
            .await
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
enum PhotoCollection {
    #[iden = "PhotoCollections"]
    Table,
    #[iden = "referenceId"]
    ReferenceId,
    Location,
    Media,
}

#[derive(Iden)]
enum References {
    #[iden = "References"]
    Table,
    Id,
}
