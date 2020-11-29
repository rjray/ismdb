module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("OAuthTokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      accessToken: {
        type: Sequelize.STRING(1024),
        allowNull: false,
      },
      accessTokenExpires: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      refreshToken: {
        type: Sequelize.STRING(1024),
        allowNull: false,
      },
      refreshTokenExpires: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("OAuthTokens");
  },
};
