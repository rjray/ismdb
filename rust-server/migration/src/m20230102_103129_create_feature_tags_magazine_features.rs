use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(FeatureTagsMagazineFeatures::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(
                            FeatureTagsMagazineFeatures::FeatureTagId
                        )
                            .integer()
                            .not_null()
                    )
                    .col(
                        ColumnDef::new(
                            FeatureTagsMagazineFeatures::MagazineFeatureId
                        )
                            .integer()
                            .not_null()
                    )
                    .primary_key(
                        Index::create()
                            .col(FeatureTagsMagazineFeatures::FeatureTagId)
                            .col(FeatureTagsMagazineFeatures::MagazineFeatureId)
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_featuretagsmagazinefeatures_featuretag")
                            .from(
                                FeatureTagsMagazineFeatures::Table,
                                FeatureTagsMagazineFeatures::FeatureTagId
                            )
                            .to(FeatureTags::Table, FeatureTags::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name(
                                "FK_featuretagsmagazinefeatures_magazinefeature"
                            )
                            .from(
                                FeatureTagsMagazineFeatures::Table,
                                FeatureTagsMagazineFeatures::MagazineFeatureId,
                            )
                            .to(
                                MagazineFeatures::Table,
                                MagazineFeatures::ReferenceId
                            )
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(
                Table::drop()
                    .table(FeatureTagsMagazineFeatures::Table)
                    .to_owned(),
            )
            .await
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
enum FeatureTagsMagazineFeatures {
    Table,
    FeatureTagId,
    MagazineFeatureId,
}

#[derive(Iden)]
enum FeatureTags {
    Table,
    Id,
}

#[derive(Iden)]
enum MagazineFeatures {
    Table,
    ReferenceId,
}
