"use strict"

module.exports = {
  up: queryInterface => {
    return queryInterface
      .addIndex("AuthorsReferences", {
        fields: ["authorId"],
        name: "authors_references_author",
      })
      .then(() => {
        return queryInterface.addIndex("AuthorsReferences", {
          fields: ["referenceId"],
          name: "authors_references_reference",
        })
      })
  },

  down: queryInterface => {
    return queryInterface
      .removeIndex("AuthorsReferences", "authors_references_author")
      .then(() => {
        return queryInterface.removeIndex(
          "AuthorsReferences",
          "authors_references_reference",
        )
      })
  },
}
