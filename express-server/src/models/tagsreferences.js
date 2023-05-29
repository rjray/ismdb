/*
  TagsReferences relational model definition.
 */

import { Model } from "sequelize";

export default (sequelize) => {
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
