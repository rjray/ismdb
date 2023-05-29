/*
  Database set-up/tear-down for Publishers table.
 */

/* eslint-disable import/no-dynamic-require */
const { Publisher } = require(`${__dirname}/../config/string_fields`);

export async function up(queryInterface, Sequelize) {
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
}

export async function down(queryInterface) {
  await queryInterface.dropTable("Publishers");
}
