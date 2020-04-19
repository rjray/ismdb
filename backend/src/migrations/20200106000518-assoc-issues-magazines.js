"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("MagazineIssues", "magazineId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Magazines",
        key: "id",
      },
      onDelete: "CASCADE",
    })
  },

  down: queryInterface => {
    if (queryInterface.sequelize.getDialect() !== "sqlite") {
      return queryInterface.removeColumn("MagazineIssues", "magazineId")
    }
  },
}
