module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UsersOAuthScopes", {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      oauthScopeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "OAuthScopes",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("UsersOAuthScopes");
  },
};
