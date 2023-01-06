use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(UsersAuthScopes::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(UsersAuthScopes::UserId)
                            .integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(UsersAuthScopes::AuthScopeId)
                            .integer()
                            .not_null(),
                    )
                    .primary_key(
                        Index::create()
                            .col(UsersAuthScopes::UserId)
                            .col(UsersAuthScopes::AuthScopeId),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_usersauthscopes_user")
                            .from(
                                UsersAuthScopes::Table,
                                UsersAuthScopes::UserId,
                            )
                            .to(Users::Table, Users::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_usersauthscopes_authscope")
                            .from(
                                UsersAuthScopes::Table,
                                UsersAuthScopes::AuthScopeId,
                            )
                            .to(AuthScopes::Table, AuthScopes::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(UsersAuthScopes::Table).to_owned())
            .await
    }
}

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
enum UsersAuthScopes {
    Table,
    UserId,
    AuthScopeId,
}

#[derive(Iden)]
enum Users {
    Table,
    Id,
}

#[derive(Iden)]
enum AuthScopes {
    Table,
    Id,
}
