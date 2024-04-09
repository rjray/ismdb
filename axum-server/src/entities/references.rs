//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15

use sea_orm::entity::prelude::*;

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "References"
    }
}

#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Eq)]
pub struct Model {
    pub id: Option<i32>,
    pub name: String,
    pub language: Option<String>,
    pub created_at: DateTime,
    pub updated_at: DateTime,
    pub reference_type_id: i32,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Name,
    Language,
    #[sea_orm(column_name = "createdAt")]
    CreatedAt,
    #[sea_orm(column_name = "updatedAt")]
    UpdatedAt,
    #[sea_orm(column_name = "referenceTypeId")]
    ReferenceTypeId,
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
    AuthorsReferences,
    Books,
    MagazineFeatures,
    PhotoCollections,
    ReferenceTypes,
    TagsReferences,
}

impl ColumnTrait for Column {
    type EntityName = Entity;
    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::Integer.def().null(),
            Self::Name => ColumnType::String(None).def(),
            Self::Language => ColumnType::String(None).def().null(),
            Self::CreatedAt => ColumnType::DateTime.def(),
            Self::UpdatedAt => ColumnType::DateTime.def(),
            Self::ReferenceTypeId => ColumnType::Integer.def(),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::AuthorsReferences => Entity::has_many(super::authors_references::Entity).into(),
            Self::Books => Entity::has_one(super::books::Entity).into(),
            Self::MagazineFeatures => Entity::has_one(super::magazine_features::Entity).into(),
            Self::PhotoCollections => Entity::has_one(super::photo_collections::Entity).into(),
            Self::ReferenceTypes => Entity::belongs_to(super::reference_types::Entity)
                .from(Column::ReferenceTypeId)
                .to(super::reference_types::Column::Id)
                .into(),
            Self::TagsReferences => Entity::has_many(super::tags_references::Entity).into(),
        }
    }
}

impl Related<super::authors_references::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::AuthorsReferences.def()
    }
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

impl Related<super::tags_references::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::TagsReferences.def()
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