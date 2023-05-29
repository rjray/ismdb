/*
  Database set-up/tear-down for References table.
 */

/* eslint-disable import/no-dynamic-require */
const { Reference } = require(`${__dirname}/../config/string_fields`);

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("References", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING(Reference.name),
      allowNull: false,
    },
    language: {
      type: Sequelize.STRING(Reference.language),
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("References");
}
