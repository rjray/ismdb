"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("AuthorAliases", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
    })
  },
  down: queryInterface => {
    return queryInterface.dropTable("AuthorAliases")
  },
}
