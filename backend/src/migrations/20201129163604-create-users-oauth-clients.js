module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UsersOAuthClients", {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      oauthClientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "OAuthClients",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("UsersOAuthClients");
  },
};
