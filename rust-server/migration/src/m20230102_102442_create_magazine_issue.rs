use common::enums::{MagazineIssues, Magazines};
use common::string_fields::MAGAZINE_ISSUE_FIELDS;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(MagazineIssues::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(MagazineIssues::Id)
                            .unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(MagazineIssues::MagazineId).unsigned())
                    .col(
                        ColumnDef::new(MagazineIssues::Issue)
                            .string_len(
                                *MAGAZINE_ISSUE_FIELDS.get("issue").unwrap(),
                            )
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(MagazineIssues::CreatedAt)
                            .date_time()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(MagazineIssues::UpdatedAt)
                            .date_time()
                            .not_null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_magazineissue_magazine")
                            .from(MagazineIssues::Table, MagazineIssues::Id)
                            .to(Magazines::Table, Magazines::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(MagazineIssues::Table).to_owned())
            .await
    }
}
