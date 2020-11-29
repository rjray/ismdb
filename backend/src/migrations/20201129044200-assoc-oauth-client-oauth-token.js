module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("OAuthTokens", "oauthClientId", {
      type: Sequelize.INTEGER,
      references: {
        model: "OAuthClients",
        key: "id",
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("OAuthTokens", "oauthClientId");
  },
};
