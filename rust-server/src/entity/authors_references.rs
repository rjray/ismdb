//! `SeaORM` Entity. Generated by sea-orm-codegen 0.10.6

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "authors_references")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub author_id: i32,
    #[sea_orm(primary_key, auto_increment = false)]
    pub reference_id: i32,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::author::Entity",
        from = "Column::AuthorId",
        to = "super::author::Column::Id",
        on_update = "NoAction",
        on_delete = "Cascade"
    )]
    Author,
    #[sea_orm(
        belongs_to = "super::reference::Entity",
        from = "Column::ReferenceId",
        to = "super::reference::Column::Id",
        on_update = "NoAction",
        on_delete = "Cascade"
    )]
    Reference,
}

impl Related<super::author::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Author.def()
    }
}

impl Related<super::reference::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Reference.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
