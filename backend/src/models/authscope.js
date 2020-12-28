const {
  createStringGetter,
  createStringSetter,
} = require("../lib/getter-setter");

module.exports = (sequelize, DataTypes) => {
  const OAuthScope = sequelize.define(
    "OAuthScope",
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
  OAuthScope.associate = function (models) {
    OAuthScope.belongsToMany(models.User, {
      as: "Users",
      through: { model: models.UsersOAuthScopes },
      foreignKey: "oauthScopeId",
    });
  };

  return OAuthScope;
};
