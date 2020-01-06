"use strict"

module.exports = {
  up: queryInterface => {
    if (queryInterface.sequelize.getDialect() === "mysql") {
      return queryInterface.sequelize.query(
        `ALTER DATABASE ${queryInterface.sequelize.config.database}
          CHARACTER SET utf8 COLLATE utf8_general_ci;`
      )
    } else {
      return Promise.resolve(null)
    }
  },
  down: () => {},
}
