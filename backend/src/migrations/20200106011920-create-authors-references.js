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
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      referenceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "References",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
