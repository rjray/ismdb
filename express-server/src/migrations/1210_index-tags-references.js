/*
  Create/remove indexes and primary key constraint on TagsReferences table.
 */

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addConstraint("TagsReferences", {
      fields: ["tagId", "referenceId"],
      name: "tags_references_pk",
      type: "primary key",
    });
    await queryInterface.addIndex("TagsReferences", {
      fields: ["tagId"],
      name: "tags_references_tag",
    });
    await queryInterface.addIndex("TagsReferences", {
      fields: ["referenceId"],
      name: "tags_references_reference",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint(
      "TagsReferences",
      "tags_references_pk"
    );
    await queryInterface.removeIndex("TagsReferences", "tags_references_tag");
    await queryInterface.removeIndex(
      "TagsReferences",
      "tags_references_reference"
    );
  },
};
