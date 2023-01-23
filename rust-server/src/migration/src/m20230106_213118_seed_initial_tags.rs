use common::enums::Tags;
use sea_orm_migration::prelude::*;

static META_TAGS: &str = "aircraft,An aircraft subject
armor,A ground vehicle subject
figures,A figurine subject
scifi,A science fiction/fantasy subject
ships,A naval/nautical subject
techniques,An entry focusing on techniques
automotive,A civilian ground vehicle subject
diorama,A diorama subject
";

static NATIONALITY_TAGS: &str = "american,the USA
australian,Australia
austrian,Austria
belgian,Belgium
canadian,Canada
chinese,China
czech,the Czech Republic
egyptian,Egypt
finnish,Finland
french,France
german,Germany
greek,Greece
indian,India
iranian,Iran
iraqi,Iraq
irish,Ireland
israeli,Israel
italian,Italy
japanese,Japan
lebanese,Lebanon
libyan,Libya
mexican,Mexico
dutch,The Netherlands
pakistani,Pakistan
palestinian,Palestine
polish,Poland
russian,Russia
saudi,Saudi Arabia
scottish,Scotland
spanish,Spain
swedish,Sweden
swiss,Switzerland
syrian,Syria
turkish,Turkey
ukrainian,Ukraine
british,England
";

static SCALES: &[u32] = &[
    6, 8, 9, 12, 16, 20, 24, 25, 30, 32, 35, 43, 48, 72, 76, 96, 100, 144, 150,
    200, 288, 350, 700, 720,
];

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let lines: Vec<Vec<&str>> =
            META_TAGS.lines().map(|s| s.split(",").collect()).collect();

        for line in lines {
            let mut values = line.clone();
            values.push("meta");

            let insert = Query::insert()
                .into_table(Tags::Table)
                .columns([Tags::Name, Tags::Description, Tags::Type])
                .values_panic(values.into_iter().map(|s| s.into()))
                .to_owned();

            manager.exec_stmt(insert).await?;
        }

        let lines: Vec<Vec<&str>> = NATIONALITY_TAGS
            .lines()
            .map(|s| s.split(",").collect())
            .collect();

        for line in lines {
            let mut values = line.clone();
            let mut country: String = "Manufactured or operated by ".to_owned();
            country.push_str(values.pop().unwrap());
            values.push(&country);
            values.push("nationality");

            let insert = Query::insert()
                .into_table(Tags::Table)
                .columns([Tags::Name, Tags::Description, Tags::Type])
                .values_panic(values.into_iter().map(|s| s.into()))
                .to_owned();

            manager.exec_stmt(insert).await?;
        }

        let scales: Vec<String> = SCALES
            .into_iter()
            .map(|s| format!("1/{}", s.to_string()))
            .collect();

        for scale in scales {
            let description = format!("{} scale subject", &scale);

            let insert = Query::insert()
                .into_table(Tags::Table)
                .columns([Tags::Name, Tags::Description, Tags::Type])
                .values_panic([
                    scale.into(),
                    description.into(),
                    "scale".into(),
                ])
                .to_owned();

            manager.exec_stmt(insert).await?;
        }

        Ok(())
    }
}
