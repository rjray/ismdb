/*
  Seed the currently-known basic tags: meta tags, scale tags, nationalities.
 */

export async function up(queryInterface) {
  let id = 0;

  const meta = `aircraft,An aircraft subject
armor,A ground vehicle subject
figures,A figurine subject
scifi,A science fiction/fantasy subject
ships,A naval/nautical subject
techniques,An entry focusing on techniques
automotive,A civilian ground vehicle subject
diorama,A diorama subject`
    .split("\n")
    .sort()
    .map((line) => line.split(","))
    .map(([name, description]) => ({
      id: ++id,
      name,
      description,
      type: "meta",
    }));
  await queryInterface.bulkInsert("Tags", meta);

  const nationalities = `american,the USA
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
british,England`
    .split("\n")
    .sort()
    .map((line) => line.split(","))
    .map(([name, country]) => ({
      id: ++id,
      name,
      description: `Manufactured or operated by ${country}`,
      type: "nationality",
    }));
  await queryInterface.bulkInsert("Tags", nationalities);

  const scales = [
    6, 8, 9, 12, 16, 20, 24, 25, 30, 32, 35, 43, 48, 72, 76, 96, 100, 144, 150,
    200, 288, 350, 700,
  ].map((scale) => ({
    id: ++id,
    name: `1/${scale}`,
    description: `1/${scale} scale subject`,
    type: "scale",
  }));
  await queryInterface.bulkInsert("Tags", scales);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("Tags", null, {});
}
