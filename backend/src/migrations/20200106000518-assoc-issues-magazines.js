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
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
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
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      })
    }
  },

  down: queryInterface => {
    if (queryInterface.sequelize.getDialect() !== "sqlite") {
      return queryInterface.removeColumn("MagazineIssues", "magazineId")
    }
  },
}
