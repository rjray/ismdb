"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() === "sqlite") {
      return queryInterface.addColumn("AuthorAliases", "authorId", {
        type: Sequelize.INTEGER,
        references: {
          model: "Authors",
          key: "id",
        },
      })
    } else {
      return queryInterface.addColumn("AuthorAliases", "authorId", {
        type: Sequelize.INTEGER,
        references: {
          model: "Authors",
          key: "id",
        },
        allowNull: false,
      })
    }
  },

  down: (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() !== "sqlite") {
      return queryInterface.removeColumn("AuthorAliases", "authorId")
    }
  },
}
