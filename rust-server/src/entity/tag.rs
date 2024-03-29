//! `SeaORM` Entity. Generated by sea-orm-codegen 0.10.6

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(
    Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize,
)]
#[sea_orm(table_name = "tags")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub r#type: Option<String>,
    pub description: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl Related<super::reference::Entity> for Entity {
    fn to() -> RelationDef {
        super::tags_references::Relation::Reference.def()
    }
    fn via() -> Option<RelationDef> {
        Some(super::tags_references::Relation::Tag.def().rev())
    }
}

impl ActiveModelBehavior for ActiveModel {}
