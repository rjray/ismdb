"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("AuthorAliases", "authorId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Authors",
        key: "id",
      },
      onDelete: "CASCADE",
    })
  },

  down: (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() !== "sqlite") {
      return queryInterface.removeColumn("AuthorAliases", "authorId")
    }
  },
}
