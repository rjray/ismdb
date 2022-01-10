/*
  Database set-up/tear-down for MagazineFeatures table.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("MagazineFeatures", {
      referenceId: {
        allowNull: false,
        primaryKey: true,
        references: {
          model: "References",
          key: "id",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("MagazineFeatures");
  },
};
