/*
  Create/remove indexes and primary key constraint on AuthorsReferences table.
 */

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addConstraint("AuthorsReferences", {
      fields: ["authorId", "referenceId"],
      name: "authors_references_pk",
      type: "primary key",
    });
    await queryInterface.addIndex("AuthorsReferences", {
      fields: ["authorId"],
      name: "authors_references_author",
    });
    await queryInterface.addIndex("AuthorsReferences", {
      fields: ["referenceId"],
      name: "authors_references_reference",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint(
      "AuthorsReferences",
      "authors_references_pk"
    );
    await queryInterface.removeIndex(
      "AuthorsReferences",
      "authors_references_author"
    );
    await queryInterface.removeIndex(
      "AuthorsReferences",
      "authors_references_reference"
    );
  },
};
