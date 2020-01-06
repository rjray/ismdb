"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Authors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      aliases: {
        type: Sequelize.STRING(1000),
      },
    })
  },
  down: queryInterface => {
    return queryInterface.dropTable("Authors")
  },
}
