/*
  Database set-up/tear-down for Books table.
 */

/* eslint-disable import/no-dynamic-require */
const { Book } = require(`${__dirname}/../config/string_fields`);

export async function up(queryInterface, Sequelize) {
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
    seriesNumber: {
      type: Sequelize.STRING(Book.seriesNumber),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("Books");
}
