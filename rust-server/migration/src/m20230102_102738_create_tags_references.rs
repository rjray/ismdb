use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(TagsReferences::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(TagsReferences::TagId)
                            .integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(TagsReferences::ReferenceId)
                            .integer()
                            .not_null(),
                    )
                    .primary_key(
                        Index::create()
                            .col(TagsReferences::TagId)
                            .col(TagsReferences::ReferenceId),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_tagsreferences_tag")
                            .from(TagsReferences::Table, TagsReferences::TagId)
                            .to(Tags::Table, Tags::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_tagsreferences_reference")
                            .from(
                                TagsReferences::Table,
                                TagsReferences::ReferenceId,
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
            .drop_table(Table::drop().table(TagsReferences::Table).to_owned())
            .await
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
enum TagsReferences {
    Table,
    TagId,
    ReferenceId,
}

#[derive(Iden)]
enum Tags {
    Table,
    Id,
}

#[derive(Iden)]
enum References {
    Table,
    Id,
}
