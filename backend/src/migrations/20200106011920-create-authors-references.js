"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("AuthorsReferences", {
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Authors",
          key: "id",
        },
      },
      referenceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "References",
          key: "id",
        },
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    })
  },
  down: queryInterface => {
    return queryInterface.dropTable("AuthorsReferences")
  },
}