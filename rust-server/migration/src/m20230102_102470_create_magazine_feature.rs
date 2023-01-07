use common::enums::{MagazineFeatures, MagazineIssues, References};
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(MagazineFeatures::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(MagazineFeatures::ReferenceId)
                            .unsigned()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(MagazineFeatures::MagazineIssueId)
                            .unsigned()
                            .not_null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_magazinefeature_reference")
                            .from(
                                MagazineFeatures::Table,
                                MagazineFeatures::ReferenceId,
                            )
                            .to(References::Table, References::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_magazinefeature_magazineissue")
                            .from(
                                MagazineFeatures::Table,
                                MagazineFeatures::MagazineIssueId,
                            )
                            .to(MagazineIssues::Table, MagazineIssues::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(MagazineFeatures::Table).to_owned())
            .await
    }
}
