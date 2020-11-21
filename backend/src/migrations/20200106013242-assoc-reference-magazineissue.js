module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("References", "magazineIssueId", {
      type: Sequelize.INTEGER,
      references: {
        model: "MagazineIssues",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("References", "magazineIssueId");
  },
};
