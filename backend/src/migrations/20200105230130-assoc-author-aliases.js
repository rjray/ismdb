"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("AuthorAliases", "authorId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Authors",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("AuthorAliases", "authorId");
  },
};
