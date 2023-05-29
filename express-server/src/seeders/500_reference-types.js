/*
  Seed the currently-known reference types (book, article, photos).
 */

export async function up(queryInterface) {
  const types = `1,book,Book
2,article,Magazine Feature
3,photos,Photo Collection`
    .split("\n")
    .map((line) => line.split(","))
    .map(([id, name, description]) => ({
      id,
      name,
      description,
    }));
  await queryInterface.bulkInsert("ReferenceTypes", types);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("ReferenceTypes", null, {});
}
