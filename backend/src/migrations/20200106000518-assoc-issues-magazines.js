"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() === "sqlite") {
      return queryInterface
        .addColumn("MagazineIssues", "magazineId", {
          type: Sequelize.INTEGER,
          references: {
            model: "Magazines",
            key: "id",
          },
        })
        .then(() => {
          queryInterface.changeColumn("MagazineIssues", "magazineId", {
            type: Sequelize.INTEGER,
            allowNull: false,
          })
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
