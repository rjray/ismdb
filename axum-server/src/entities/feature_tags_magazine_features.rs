//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15

use sea_orm::entity::prelude::*;

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "FeatureTagsMagazineFeatures"
    }
}

#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Eq)]
pub struct Model {
    pub feature_tag_id: i32,
    pub magazine_feature_id: i32,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    #[sea_orm(column_name = "featureTagId")]
    FeatureTagId,
    #[sea_orm(column_name = "magazineFeatureId")]
    MagazineFeatureId,
}

#[derive(Copy, Clone, Debug, EnumIter, DerivePrimaryKey)]
pub enum PrimaryKey {
    FeatureTagId,
    MagazineFeatureId,
}

impl PrimaryKeyTrait for PrimaryKey {
    type ValueType = (i32, i32);
    fn auto_increment() -> bool {
        false
    }
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    FeatureTags,
    MagazineFeatures,
}

impl ColumnTrait for Column {
    type EntityName = Entity;
    fn def(&self) -> ColumnDef {
        match self {
            Self::FeatureTagId => ColumnType::Integer.def(),
            Self::MagazineFeatureId => ColumnType::Integer.def(),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::FeatureTags => Entity::belongs_to(super::feature_tags::Entity)
                .from(Column::FeatureTagId)
                .to(super::feature_tags::Column::Id)
                .into(),
            Self::MagazineFeatures => Entity::belongs_to(super::magazine_features::Entity)
                .from(Column::MagazineFeatureId)
                .to(super::magazine_features::Column::Id)
                .into(),
        }
    }
}

impl Related<super::feature_tags::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::FeatureTags.def()
    }
}

impl Related<super::magazine_features::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::MagazineFeatures.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
