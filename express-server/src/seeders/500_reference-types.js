/*
  Seed the currently-known reference types (book, article, photos).
 */

module.exports = {
  up: async (queryInterface) => {
    const types = `1,book,Book
2,magazineFeature,Magazine Feature
3,photoCollection,Photo Collection`
      .split("\n")
      .map((line) => line.split(","))
      .map(([id, name, description]) => ({
        id,
        name,
        description,
      }));
    await queryInterface.bulkInsert("ReferenceTypes", types);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("ReferenceTypes", null, {});
  },
};
