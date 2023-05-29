/*
  Database set-up/tear-down for ReferenceTypes table.
 */

/* eslint-disable import/no-dynamic-require */
const { ReferenceType } = require(`${__dirname}/../config/string_fields`);

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("ReferenceTypes", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING(ReferenceType.name),
      unique: true,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(ReferenceType.description),
      allowNull: false,
    },
    notes: {
      type: Sequelize.STRING(ReferenceType.notes),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("ReferenceTypes");
}
