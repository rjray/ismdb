/*
  Database set-up/tear-down for AuthorAliases table.
 */

/* eslint-disable import/no-dynamic-require */
const { AuthorAlias } = require(`${__dirname}/../config/string_fields`);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("AuthorAliases", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(AuthorAlias.name),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("AuthorAliases");
  },
};
