/*
  Database set-up/tear-down for MagazineIssues table.
 */

/* eslint-disable import/no-dynamic-require */
const { MagazineIssue } = require(`${__dirname}/../config/string_fields`);

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("MagazineIssues", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    issue: {
      type: Sequelize.STRING(MagazineIssue.issue),
      allowNull: false,
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
  await queryInterface.dropTable("MagazineIssues");
}
