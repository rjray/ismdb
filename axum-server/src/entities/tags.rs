//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15

use sea_orm::entity::prelude::*;

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "Tags"
    }
}

#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Eq)]
pub struct Model {
    pub id: i32,
    pub name: String,
    pub r#type: Option<String>,
    pub description: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Name,
    Type,
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
    TagsReferences,
}

impl ColumnTrait for Column {
    type EntityName = Entity;
    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::Integer.def().unique(),
            Self::Name => ColumnType::String(None).def().unique(),
            Self::Type => ColumnType::String(None).def().null(),
            Self::Description => ColumnType::String(None).def().null(),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::TagsReferences => Entity::has_many(super::tags_references::Entity).into(),
        }
    }
}

impl Related<super::tags_references::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::TagsReferences.def()
    }
}

impl Related<super::references::Entity> for Entity {
    fn to() -> RelationDef {
        super::tags_references::Relation::References.def()
    }
    fn via() -> Option<RelationDef> {
        Some(super::tags_references::Relation::Tags.def().rev())
    }
}

impl ActiveModelBehavior for ActiveModel {}
