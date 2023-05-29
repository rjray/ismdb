/*
  Database set-up/tear-down for UsersAuthScopes table.
 */

export async function up(queryInterface, Sequelize) {
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
}

export async function down(queryInterface) {
  await queryInterface.dropTable("UsersAuthScopes");
}
