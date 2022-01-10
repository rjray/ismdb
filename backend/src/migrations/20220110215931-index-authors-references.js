/*
  Create/remove indexes and unique constraint on AuthorsReferences table.
 */

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addIndex("AuthorsReferences", {
      fields: ["authorId"],
      name: "authors_references_author",
    });
    await queryInterface.addIndex("AuthorsReferences", {
      fields: ["referenceId"],
      name: "authors_references_reference",
    });
    await queryInterface.addConstraint("AuthorsReferences", {
      fields: ["authorId", "referenceId"],
      name: "authors_references_unique",
      type: "unique",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex(
      "AuthorsReferences",
      "authors_references_author"
    );
    await queryInterface.removeIndex(
      "AuthorsReferences",
      "authors_references_reference"
    );
    await queryInterface.removeConstraint(
      "AuthorsReferences",
      "authors_references_unique"
    );
  },
};
