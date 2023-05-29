/*
  AuthorAlias model definition.
 */

import { Model } from "sequelize";

export default (sequelize, DataTypes, { AuthorAlias: fields }) => {
  class AuthorAlias extends Model {
    static associate(models) {
      AuthorAlias.belongsTo(models.Author, { onDelete: "CASCADE" });
    }

    clean() {
      const result = this.get();

      delete result.AuthorId;

      return result;
    }
  }

  AuthorAlias.init(
    {
      name: {
        type: DataTypes.STRING(fields.name),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AuthorAlias",
      timestamps: false,
    }
  );

  return AuthorAlias;
};
