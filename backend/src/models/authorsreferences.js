/*
  AuthorsReferences relational model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize) => {
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
