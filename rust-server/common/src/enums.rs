use sea_orm_migration::prelude::*;

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
pub enum ReferenceTypes {
    Table,
    Id,
    Name,
    Description,
    Notes,
}

#[derive(Iden)]
pub enum References {
    Table,
    Id,
    Name,
    Language,
    ReferenceTypeId,
    CreatedAt,
    UpdatedAt,
}

#[derive(Iden)]
pub enum PhotoCollections {
    Table,
    ReferenceId,
    Location,
    Media,
}

#[derive(Iden)]
pub enum Publishers {
    Table,
    Id,
    Name,
    Notes,
}

#[derive(Iden)]
pub enum Series {
    Table,
    Id,
    Name,
    Notes,
    PublisherId,
}

#[derive(Iden)]
pub enum Books {
    Table,
    ReferenceId,
    PublisherId,
    SeriesId,
    SeriesNumber,
    ISBN,
}

#[derive(Iden)]
pub enum Magazines {
    Table,
    Id,
    Name,
    Language,
    Aliases,
    Notes,
    CreatedAt,
    UpdatedAt,
}

#[derive(Iden)]
pub enum MagazineIssues {
    Table,
    Id,
    MagazineId,
    Issue,
    CreatedAt,
    UpdatedAt,
}

#[derive(Iden)]
pub enum MagazineFeatures {
    Table,
    ReferenceId,
    MagazineIssueId,
}

#[derive(Iden)]
pub enum Authors {
    Table,
    Id,
    Name,
    CreatedAt,
    UpdatedAt,
}

#[derive(Iden)]
pub enum AuthorAliases {
    Table,
    Id,
    Name,
    AuthorId,
}

#[derive(Iden)]
pub enum Tags {
    Table,
    Id,
    Name,
    Type,
    Description,
}

#[derive(Iden)]
pub enum FeatureTags {
    Table,
    Id,
    Name,
    Description,
}

#[derive(Iden)]
pub enum Users {
    Table,
    Id,
    Name,
    Email,
    Username,
    Password,
    CreatedAt,
    UpdatedAt,
}

#[derive(Iden)]
pub enum AuthScopes {
    Table,
    Id,
    Name,
    Description,
}

#[derive(Iden)]
pub enum UsersAuthScopes {
    Table,
    UserId,
    AuthScopeId,
}

#[derive(Iden)]
pub enum AuthorsReferences {
    Table,
    AuthorId,
    ReferenceId,
}

#[derive(Iden)]
pub enum TagsReferences {
    Table,
    TagId,
    ReferenceId,
}

#[derive(Iden)]
pub enum FeatureTagsMagazineFeatures {
    Table,
    FeatureTagId,
    MagazineFeatureId,
}
