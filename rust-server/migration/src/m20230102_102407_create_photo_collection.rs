use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(PhotoCollections::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(PhotoCollections::ReferenceId)
                            .unsigned()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(PhotoCollections::Location)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(PhotoCollections::Media)
                            .string()
                            .not_null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_photocollection_reference")
                            .from(
                                PhotoCollections::Table,
                                PhotoCollections::ReferenceId,
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
            .drop_table(Table::drop().table(PhotoCollections::Table).to_owned())
            .await
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
enum PhotoCollections {
    Table,
    ReferenceId,
    Location,
    Media,
}

#[derive(Iden)]
enum References {
    Table,
    Id,
}
