//! `SeaORM` Entity. Generated by sea-orm-codegen 0.10.6

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(
    Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize,
)]
#[sea_orm(table_name = "magazines")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub language: Option<String>,
    pub aliases: Option<String>,
    pub notes: Option<String>,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::magazine_issue::Entity")]
    MagazineIssues,
}

impl Related<super::magazine_issue::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::MagazineIssues.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
