/*
  Database set-up/tear-down for Tags table.
 */

/* eslint-disable import/no-dynamic-require */
const { Tag } = require(`${__dirname}/../config/string_fields`);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Tags", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(Tag.name),
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(Tag.type),
      },
      description: {
        type: Sequelize.STRING(Tag.description),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Tags");
  },
};
