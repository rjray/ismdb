module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UsersAuthClients", {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      authClientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "AuthClients",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("UsersAuthClients");
  },
};
