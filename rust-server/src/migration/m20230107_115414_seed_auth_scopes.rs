use common::enums::AuthScopes;
use sea_orm_migration::prelude::*;

static AUTH_SCOPES: &str = "admin,Administrative account
user,Create and update data
guest,Read-only account
";

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let lines: Vec<Vec<&str>> = AUTH_SCOPES
            .lines()
            .map(|s| s.split(",").collect())
            .collect();

        for line in lines {
            let insert = Query::insert()
                .into_table(AuthScopes::Table)
                .columns([AuthScopes::Name, AuthScopes::Description])
                .values_panic(line.into_iter().map(|s| s.into()))
                .to_owned();

            manager.exec_stmt(insert).await?;
        }

        Ok(())
    }
}
