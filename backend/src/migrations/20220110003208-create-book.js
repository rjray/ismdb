/*
  Database set-up/tear-down for Books table.
 */

/* eslint-disable import/no-dynamic-require */
const { Book } = require(`${__dirname}/../config/string_fields`);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Books", {
      referenceId: {
        allowNull: false,
        primaryKey: true,
        references: {
          model: "References",
          key: "id",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
      isbn: {
        type: Sequelize.STRING(Book.isbn),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("Books");
  },
};
