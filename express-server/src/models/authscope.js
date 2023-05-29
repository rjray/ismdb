/*
  AuthScope model definition.
 */

import { Model } from "sequelize";

export default (sequelize, DataTypes, { AuthScope: fields }) => {
  class AuthScope extends Model {
    static associate(models) {
      AuthScope.belongsToMany(models.User, {
        as: "Users",
        through: { model: models.UsersAuthScopes },
        foreignKey: "authScopeId",
      });
    }
  }

  AuthScope.init(
    {
      name: {
        type: DataTypes.STRING(fields.name),
        allowNull: false,
        unique: true,
      },
      description: DataTypes.STRING(fields.description),
    },
    {
      sequelize,
      modelName: "AuthScope",
      timestamps: false,
    }
  );

  return AuthScope;
};
