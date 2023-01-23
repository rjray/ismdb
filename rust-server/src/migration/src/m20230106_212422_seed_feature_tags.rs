use common::enums::FeatureTags;
use sea_orm_migration::prelude::*;

static FEATURE_TAGS: &str = "color illustrations
color plates
color profiles
coloring guides
construction
conversion
cut-away
detail illustration
detailing
diorama
drawings
finishing
history
illustrations
interior drawings
line drawings
painting
photo essay
photos
placeholder
profiles
review
scale plans
scratchbuilding
sidebar
single topic issue
techniques
unknown
walk-around
";

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let lines: Vec<&str> = FEATURE_TAGS.lines().collect();

        for line in lines {
            let insert = Query::insert()
                .into_table(FeatureTags::Table)
                .columns([FeatureTags::Name])
                .values_panic([line.into()])
                .to_owned();

            manager.exec_stmt(insert).await?;
        }

        Ok(())
    }
}
