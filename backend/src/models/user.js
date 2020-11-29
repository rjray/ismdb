module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING(75),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
    },
    {}
  );
  User.associate = function (models) {
    User.hasMany(models.OAuthToken);
    User.belongsToMany(models.OAuthClient, {
      as: "Clients",
      through: { model: models.UsersOAuthClients },
      foreignKey: "userId",
    });
    User.belongsToMany(models.OAuthScope, {
      as: "Scopes",
      through: { model: models.UsersOAuthScopes },
      foreignKey: "userId",
    });
  };

  return User;
};
