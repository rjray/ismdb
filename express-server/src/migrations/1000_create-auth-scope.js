/*
  Database set-up/tear-down for AuthScopes table.
 */

/* eslint-disable import/no-dynamic-require */
const { AuthScope } = require(`${__dirname}/../config/string_fields`);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("AuthScopes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(AuthScope.name),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING(AuthScope.description),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("AuthScopes");
  },
};
