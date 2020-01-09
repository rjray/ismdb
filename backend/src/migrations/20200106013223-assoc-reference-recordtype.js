"use strict"

module.exports = {
  up: (queryInterface, Sequelize) => {
    if (queryInterface.sequelize.getDialect() === "sqlite") {
      return queryInterface
        .addColumn("References", "recordTypeId", {
          type: Sequelize.INTEGER,
          references: {
            model: "RecordTypes",
            key: "id",
          },
        })
        .then(() => {
          queryInterface.changeColumn("References", "recordTypeId", {
            type: Sequelize.INTEGER,
            allowNull: false,
          })
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
    return queryInterface.removeColumn("References", "recordTypeId")
  },
}
