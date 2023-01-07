//! `SeaORM` Entity. Generated by sea-orm-codegen 0.10.6

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(
    Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize,
)]
#[sea_orm(table_name = "references")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub language: Option<String>,
    pub reference_type_id: i32,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_one = "super::books::Entity")]
    Books,
    #[sea_orm(has_one = "super::magazine_features::Entity")]
    MagazineFeatures,
    #[sea_orm(has_one = "super::photo_collections::Entity")]
    PhotoCollections,
    #[sea_orm(
        belongs_to = "super::reference_types::Entity",
        from = "Column::ReferenceTypeId",
        to = "super::reference_types::Column::Id",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    ReferenceTypes,
}

impl Related<super::books::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Books.def()
    }
}

impl Related<super::magazine_features::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::MagazineFeatures.def()
    }
}

impl Related<super::photo_collections::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::PhotoCollections.def()
    }
}

impl Related<super::reference_types::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::ReferenceTypes.def()
    }
}

impl Related<super::authors::Entity> for Entity {
    fn to() -> RelationDef {
        super::authors_references::Relation::Authors.def()
    }
    fn via() -> Option<RelationDef> {
        Some(super::authors_references::Relation::References.def().rev())
    }
}

impl Related<super::tags::Entity> for Entity {
    fn to() -> RelationDef {
        super::tags_references::Relation::Tags.def()
    }
    fn via() -> Option<RelationDef> {
        Some(super::tags_references::Relation::References.def().rev())
    }
}

impl ActiveModelBehavior for ActiveModel {}
