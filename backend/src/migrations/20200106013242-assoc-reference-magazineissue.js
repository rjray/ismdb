"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("References", "magazineIssueId", {
      type: Sequelize.INTEGER,
      references: {
        model: "MagazineIssues",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: (queryInterface) => {
    if (queryInterface.sequelize.getDialect() !== "sqlite") {
      return queryInterface.removeColumn("References", "magazineIssueId");
    }
  },
};
