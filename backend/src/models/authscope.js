const {
  createStringGetter,
  createStringSetter,
} = require("../lib/getter-setter");

module.exports = (sequelize, DataTypes) => {
  const AuthScope = sequelize.define(
    "AuthScope",
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(256),
        get: createStringGetter("description"),
        set: createStringSetter("description"),
      },
    },
    {
      timestamps: false,
    }
  );
  AuthScope.associate = function (models) {
    AuthScope.belongsToMany(models.User, {
      as: "Users",
      through: { model: models.UsersAuthScopes },
      foreignKey: "authScopeId",
    });
  };

  return AuthScope;
};
