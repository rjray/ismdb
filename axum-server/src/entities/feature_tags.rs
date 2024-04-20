//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15

use sea_orm::entity::prelude::*;

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "FeatureTags"
    }
}

#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Eq)]
pub struct Model {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Name,
    Description,
}

#[derive(Copy, Clone, Debug, EnumIter, DerivePrimaryKey)]
pub enum PrimaryKey {
    Id,
}

impl PrimaryKeyTrait for PrimaryKey {
    type ValueType = i32;
    fn auto_increment() -> bool {
        false
    }
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    FeatureTagsMagazineFeatures,
}

impl ColumnTrait for Column {
    type EntityName = Entity;
    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::Integer.def(),
            Self::Name => ColumnType::String(None).def().unique(),
            Self::Description => ColumnType::String(None).def().null(),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::FeatureTagsMagazineFeatures => {
                Entity::has_many(super::feature_tags_magazine_features::Entity).into()
            }
        }
    }
}

impl Related<super::feature_tags_magazine_features::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::FeatureTagsMagazineFeatures.def()
    }
}

impl Related<super::magazine_features::Entity> for Entity {
    fn to() -> RelationDef {
        super::feature_tags_magazine_features::Relation::MagazineFeatures.def()
    }
    fn via() -> Option<RelationDef> {
        Some(
            super::feature_tags_magazine_features::Relation::FeatureTags
                .def()
                .rev(),
        )
    }
}

impl ActiveModelBehavior for ActiveModel {}
