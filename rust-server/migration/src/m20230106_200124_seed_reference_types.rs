use common::enums::ReferenceTypes;
use sea_orm_migration::prelude::*;

static REFERENCE_TYPES: &str = "1,book,Book
2,article,Magazine Feature
3,photos,Photo Collection
";

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let lines: Vec<Vec<&str>> = REFERENCE_TYPES
            .lines()
            .map(|s| s.split(",").collect())
            .collect();

        for line in lines {
            let insert = Query::insert()
                .into_table(ReferenceTypes::Table)
                .columns([
                    ReferenceTypes::Id,
                    ReferenceTypes::Name,
                    ReferenceTypes::Description,
                ])
                .values_panic(line.into_iter().map(|s| s.into()))
                .to_owned();

            manager.exec_stmt(insert).await?;
        }

        Ok(())
    }
}
