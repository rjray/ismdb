/*
  Database set-up/tear-down for TagsReferences table.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("TagsReferences", {
    tagId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Tags",
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
  await queryInterface.dropTable("TagsReferences");
}
