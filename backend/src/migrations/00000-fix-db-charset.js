"use strict"

module.exports = {
  up: queryInterface => {
    if (queryInterface.sequelize.getDialect() === "mysql") {
      return queryInterface.sequelize.query(
        `ALTER DATABASE ${queryInterface.sequelize.config.database}
          CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
      )
    } else {
      return Promise.resolve(null)
    }
  },
  down: () => {},
}
