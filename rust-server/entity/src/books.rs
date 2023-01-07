//! `SeaORM` Entity. Generated by sea-orm-codegen 0.10.6

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(
    Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize,
)]
#[sea_orm(table_name = "books")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub reference_id: i32,
    pub publisher_id: Option<i32>,
    pub series_id: Option<i32>,
    pub series_number: Option<String>,
    pub isbn: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::publishers::Entity",
        from = "Column::PublisherId",
        to = "super::publishers::Column::Id",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    Publishers,
    #[sea_orm(
        belongs_to = "super::references::Entity",
        from = "Column::ReferenceId",
        to = "super::references::Column::Id",
        on_update = "NoAction",
        on_delete = "Cascade"
    )]
    References,
    #[sea_orm(
        belongs_to = "super::series::Entity",
        from = "Column::SeriesId",
        to = "super::series::Column::Id",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    Series,
}

impl Related<super::publishers::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Publishers.def()
    }
}

impl Related<super::references::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::References.def()
    }
}

impl Related<super::series::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Series.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
