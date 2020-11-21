module.exports = {
  up: (queryInterface) => {
    return queryInterface
      .addIndex("AuthorsReferences", {
        fields: ["authorId"],
        name: "authors_references_author",
      })
      .then(() => {
        return queryInterface.addIndex("AuthorsReferences", {
          fields: ["referenceId"],
          name: "authors_references_reference",
        });
      })
      .then(() => {
        return queryInterface.addConstraint("AuthorsReferences", {
          fields: ["authorId", "referenceId"],
          name: "authors_references_unique",
          type: "unique",
        });
      });
  },

  down: (queryInterface) => {
    return queryInterface
      .removeIndex("AuthorsReferences", "authors_references_author")
      .then(() => {
        return queryInterface.removeIndex(
          "AuthorsReferences",
          "authors_references_reference"
        );
      })
      .then(() => {
        return queryInterface.removeConstraint(
          "AuthorsReferences",
          "authors_references_unique"
        );
      });
  },
};
