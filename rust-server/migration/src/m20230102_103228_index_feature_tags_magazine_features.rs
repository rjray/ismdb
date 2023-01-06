use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_index(
                Index::create()
                    .name("IDX_featuretags_magazinefeatures_featuretag")
                    .table(FeatureTagsMagazineFeatures::Table)
                    .if_not_exists()
                    .col(FeatureTagsMagazineFeatures::FeatureTagId)
                    .to_owned(),
            )
            .await?;
        manager
            .create_index(
                Index::create()
                    .name("IDX_featuretags_magazinefeatures_magazinefeature")
                    .table(FeatureTagsMagazineFeatures::Table)
                    .if_not_exists()
                    .col(FeatureTagsMagazineFeatures::MagazineFeatureId)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_index(
                Index::drop()
                    .name("IDX_featuretags_magazinefeatures_featuretag")
                    .table(FeatureTagsMagazineFeatures::Table)
                    .to_owned(),
            )
            .await?;
        manager
            .drop_index(
                Index::drop()
                    .name("IDX_featuretags_magazinefeatures_magazinefeature")
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
