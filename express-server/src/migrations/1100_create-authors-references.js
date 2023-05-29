/*
  Database set-up/tear-down for AuthorsReferences table.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("AuthorsReferences", {
    authorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Authors",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    referenceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "References",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("AuthorsReferences");
}
