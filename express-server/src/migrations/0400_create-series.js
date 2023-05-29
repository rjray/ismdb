/*
  Database set-up/tear-down for Series table.
 */

/* eslint-disable import/no-dynamic-require */
const { Series } = require(`${__dirname}/../config/string_fields`);

export async function up(queryInterface, Sequelize) {
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
}

export async function down(queryInterface) {
  await queryInterface.dropTable("Series");
}
