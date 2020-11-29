module.exports = (sequelize, DataTypes) => {
  const OAuthClient = sequelize.define(
    "OAuthClient",
    {
      name: {
        type: DataTypes.STRING(75),
        allowNull: false,
        unique: true,
      },
      secret: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      redirectUri: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
    },
    {}
  );
  OAuthClient.associate = function (models) {
    OAuthClient.hasMany(models.OAuthToken);
    OAuthClient.belongsToMany(models.User, {
      as: "Users",
      through: { model: models.UsersOAuthClients },
      foreignKey: "oauthClientId",
    });
  };

  return OAuthClient;
};
