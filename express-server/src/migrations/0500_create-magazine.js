/*
  Database set-up/tear-down for Magazines table.
 */

/* eslint-disable import/no-dynamic-require */
const { Magazine } = require(`${__dirname}/../config/string_fields`);

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Magazines", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING(Magazine.name),
      allowNull: false,
    },
    language: {
      type: Sequelize.STRING(Magazine.language),
    },
    aliases: {
      type: Sequelize.STRING(Magazine.aliases),
    },
    notes: {
      type: Sequelize.STRING(Magazine.notes),
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
  await queryInterface.dropTable("Magazines");
}
