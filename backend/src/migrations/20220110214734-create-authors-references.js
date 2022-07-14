/*
  Database set-up/tear-down for AuthorsReferences table.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("AuthorsReferences");
  },
};
