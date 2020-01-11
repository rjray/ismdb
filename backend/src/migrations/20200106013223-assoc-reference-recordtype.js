"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() === "sqlite") {
      return queryInterface.addColumn("References", "recordTypeId", {
        type: Sequelize.INTEGER,
        references: {
          model: "RecordTypes",
          key: "id",
        },
      })
    } else {
      return queryInterface.addColumn("References", "recordTypeId", {
        type: Sequelize.INTEGER,
        references: {
          model: "RecordTypes",
          key: "id",
        },
        allowNull: false,
      })
    }
  },

  down: queryInterface => {
    if (queryInterface.sequelize.getDialect() !== "sqlite") {
      return queryInterface.removeColumn("References", "recordTypeId")
    }
  },
}
