/*
  User model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { User: fields }) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.AuthScope, {
        as: "Scopes",
        through: { model: models.UsersAuthScopes },
        foreignKey: "userId",
      });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING(fields.name),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(fields.email),
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING(fields.username),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(fields.password),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
