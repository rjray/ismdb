/*
  Create the field for the belongsTo() association between MagazineIssues and
  Magazines.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("MagazineIssues", "magazineId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Magazines",
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("MagazineIssues", "magazineId");
  },
};
