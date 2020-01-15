"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("MagazineIssues", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      number: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    })
  },
  down: queryInterface => {
    return queryInterface.dropTable("MagazineIssues")
  },
}
