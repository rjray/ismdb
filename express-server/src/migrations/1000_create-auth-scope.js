/*
  Database set-up/tear-down for AuthScopes table.
 */

/* eslint-disable import/no-dynamic-require */
const { AuthScope } = require(`${__dirname}/../config/string_fields`);

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("AuthScopes", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING(AuthScope.name),
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.STRING(AuthScope.description),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("AuthScopes");
}
