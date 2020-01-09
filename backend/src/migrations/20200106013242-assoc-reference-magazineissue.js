"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("References", "magazineIssueId", {
      type: Sequelize.INTEGER,
      references: {
        model: "MagazineIssues",
        key: "id",
      },
    })
  },

  down: queryInterface => {
    return queryInterface.removeColumn("References", "magazineIssueId")
  },
}
