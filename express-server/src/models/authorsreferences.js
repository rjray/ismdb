/*
  AuthorsReferences relational model definition.
 */

import { Model } from "sequelize";

export default (sequelize) => {
  class AuthorsReferences extends Model {}

  AuthorsReferences.init(
    {},
    {
      sequelize,
      modelName: "AuthorsReferences",
      timestamps: false,
    }
  );

  return AuthorsReferences;
};
