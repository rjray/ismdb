/*
  TagsReferences relational model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize) => {
  class TagsReferences extends Model {}

  TagsReferences.init(
    {},
    {
      sequelize,
      modelName: "TagsReferences",
      timestamps: false,
    }
  );

  return TagsReferences;
};
