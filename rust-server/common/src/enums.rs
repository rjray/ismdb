use sea_query::Iden;

/// Learn more at https://docs.rs/sea-query#iden
#[derive(Iden)]
pub enum References {
    #[iden = "References"]
    Table,
    Id,
    Name,
    Language,
    #[iden = "referenceTypeId"]
    ReferenceTypeId,
    #[iden = "createdAt"]
    CreatedAt,
    #[iden = "updatedAt"]
    UpdatedAt,
}

#[derive(Iden)]
pub enum ReferenceTypes {
    #[iden = "ReferenceTypes"]
    Table,
    Id,
    Name,
    Description,
    Notes,
}
