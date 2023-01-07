//! `SeaORM` Entity. Generated by sea-orm-codegen 0.10.6

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(
    Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize,
)]
#[sea_orm(table_name = "auth_scopes")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl Related<super::users::Entity> for Entity {
    fn to() -> RelationDef {
        super::users_auth_scopes::Relation::Users.def()
    }
    fn via() -> Option<RelationDef> {
        Some(super::users_auth_scopes::Relation::AuthScopes.def().rev())
    }
}

impl ActiveModelBehavior for ActiveModel {}
