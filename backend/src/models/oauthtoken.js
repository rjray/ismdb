module.exports = (sequelize, DataTypes) => {
  const OAuthToken = sequelize.define(
    "OAuthToken",
    {
      accessToken: {
        type: DataTypes.STRING(1024),
        allowNull: false,
      },
      accessTokenExpires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.STRING(1024),
        allowNull: false,
      },
      refreshTokenExpires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {}
  );
  OAuthToken.associate = function (models) {
    OAuthToken.belongsTo(models.User);
    OAuthToken.belongsTo(models.OAuthClient);
  };

  return OAuthToken;
};
