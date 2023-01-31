//! `SeaORM` Entity. Generated by sea-orm-codegen 0.10.6

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(
    Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize,
)]
#[sea_orm(table_name = "magazine_issues")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub magazine_id: i32,
    pub issue: String,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::magazine_feature::Entity")]
    MagazineFeature,
    #[sea_orm(
        belongs_to = "super::magazine::Entity",
        from = "Column::Id",
        to = "super::magazine::Column::Id",
        on_update = "NoAction",
        on_delete = "Cascade"
    )]
    Magazines,
}

impl Related<super::magazine_feature::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::MagazineFeature.def()
    }
}

impl Related<super::magazine::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Magazines.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}