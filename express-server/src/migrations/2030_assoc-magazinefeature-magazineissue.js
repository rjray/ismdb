/*
  Create the field for the belongsTo() association between MagazineFeatures and
  MagazineIssues.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("MagazineFeatures", "magazineIssueId", {
      type: Sequelize.INTEGER,
      references: {
        model: "MagazineIssues",
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("MagazineFeatures", "magazineIssueId");
  },
};
