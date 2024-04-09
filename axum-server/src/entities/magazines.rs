//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15

use sea_orm::entity::prelude::*;

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "Magazines"
    }
}

#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Eq)]
pub struct Model {
    pub id: Option<i32>,
    pub name: String,
    pub language: Option<String>,
    pub aliases: Option<String>,
    pub notes: Option<String>,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Name,
    Language,
    Aliases,
    Notes,
    #[sea_orm(column_name = "createdAt")]
    CreatedAt,
    #[sea_orm(column_name = "updatedAt")]
    UpdatedAt,
}

#[derive(Copy, Clone, Debug, EnumIter, DerivePrimaryKey)]
pub enum PrimaryKey {
    Id,
}

impl PrimaryKeyTrait for PrimaryKey {
    type ValueType = Option<i32>;
    fn auto_increment() -> bool {
        false
    }
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    MagazineIssues,
}

impl ColumnTrait for Column {
    type EntityName = Entity;
    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::Integer.def().null(),
            Self::Name => ColumnType::String(None).def(),
            Self::Language => ColumnType::String(None).def().null(),
            Self::Aliases => ColumnType::String(None).def().null(),
            Self::Notes => ColumnType::String(None).def().null(),
            Self::CreatedAt => ColumnType::DateTime.def(),
            Self::UpdatedAt => ColumnType::DateTime.def(),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::MagazineIssues => Entity::has_many(super::magazine_issues::Entity).into(),
        }
    }
}

impl Related<super::magazine_issues::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::MagazineIssues.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
