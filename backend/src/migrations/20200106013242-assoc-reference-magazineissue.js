"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("References", "magazineIssueId", {
      type: Sequelize.INTEGER,
      references: {
        model: "MagazineIssues",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("References", "magazineIssueId")
  },
}
