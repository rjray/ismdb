/*
  Database set-up/tear-down for UsersAuthScopes table.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UsersAuthScopes", {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      authScopeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "AuthScopes",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("UsersAuthScopes");
  },
};
