module.exports = {
  up: (queryInterface) => {
    return queryInterface
      .addIndex("TagsReferences", {
        fields: ["tagId"],
        name: "tags_references_tag",
      })
      .then(() => {
        return queryInterface.addIndex("TagsReferences", {
          fields: ["referenceId"],
          name: "tags_references_reference",
        });
      })
      .then(() => {
        return queryInterface.addConstraint("TagsReferences", {
          fields: ["tagId", "referenceId"],
          name: "tags_references_unique",
          type: "unique",
        });
      });
  },

  down: (queryInterface) => {
    return queryInterface
      .removeIndex("TagsReferences", "tags_references_tag")
      .then(() => {
        return queryInterface.removeIndex(
          "TagsReferences",
          "tags_references_reference"
        );
      })
      .then(() => {
        return queryInterface.removeConstraint(
          "TagsReferences",
          "tags_references_unique"
        );
      });
  },
};
