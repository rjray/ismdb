module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("OAuthTokens", "userId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("OAuthTokens", "userId");
  },
};
