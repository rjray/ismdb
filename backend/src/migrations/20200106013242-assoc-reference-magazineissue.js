"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() === "sqlite") {
      return queryInterface
        .addColumn("References", "magazineIssueId", {
          type: Sequelize.INTEGER,
          references: {
            model: "MagazineIssues",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        })
        .then(() => {
          queryInterface.changeColumn("References", "magazineIssueId", {
            type: Sequelize.INTEGER,
            allowNull: false,
          })
        })
    } else {
      return queryInterface.addColumn("References", "magazineIssueId", {
        type: Sequelize.INTEGER,
        references: {
          model: "MagazineIssues",
          key: "id",
        },
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      })
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("References", "magazineIssueId")
  },
}
