/*
  Database set-up/tear-down for Publishers table.
 */

/* eslint-disable import/no-dynamic-require */
const { Publisher } = require(`${__dirname}/../config/string_fields`);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Publishers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(Publisher.name),
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING(Publisher.notes),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Publishers");
  },
};
