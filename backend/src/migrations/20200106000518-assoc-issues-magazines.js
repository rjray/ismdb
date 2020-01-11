"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() === "sqlite") {
      return queryInterface.addColumn("MagazineIssues", "magazineId", {
        type: Sequelize.INTEGER,
        references: {
          model: "Magazines",
          key: "id",
        },
      })
    } else {
      return queryInterface.addColumn("MagazineIssues", "magazineId", {
        type: Sequelize.INTEGER,
        references: {
          model: "Magazines",
          key: "id",
        },
        allowNull: false,
      })
    }
  },

  down: queryInterface => {
    if (queryInterface.sequelize.getDialect() !== "sqlite") {
      return queryInterface.removeColumn("MagazineIssues", "magazineId")
    }
  },
}
