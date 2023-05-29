/*
  Database set-up/tear-down for Series table.
 */

/* eslint-disable import/no-dynamic-require */
const { Series } = require(`${__dirname}/../config/string_fields`);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Series", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(Series.name),
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING(Series.notes),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Series");
  },
};
