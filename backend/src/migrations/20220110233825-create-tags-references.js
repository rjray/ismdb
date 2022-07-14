/*
  Database set-up/tear-down for TagsReferences table.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("TagsReferences");
  },
};
