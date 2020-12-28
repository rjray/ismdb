module.exports = (sequelize, DataTypes) => {
  const AuthClient = sequelize.define(
    "AuthClient",
    {
      name: {
        type: DataTypes.STRING(75),
        allowNull: false,
        unique: true,
      },
      secret: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      redirectUri: {
        type: DataTypes.STRING(256),
        allowNull: false,
        unique: true,
      },
    },
    {}
  );
  AuthClient.associate = function (models) {
    AuthClient.belongsToMany(models.User, {
      as: "Users",
      through: { model: models.UsersAuthClients },
      foreignKey: "authClientId",
    });
  };

  return AuthClient;
};
