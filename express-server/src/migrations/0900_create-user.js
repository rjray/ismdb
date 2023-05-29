/*
  Database set-up/tear-down for Users table.
 */

/* eslint-disable import/no-dynamic-require */
const { User } = require(`${__dirname}/../config/string_fields`);

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Users", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING(User.name),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(User.email),
      allowNull: false,
      unique: true,
    },
    username: {
      type: Sequelize.STRING(User.username),
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(User.password),
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
  await queryInterface.dropTable("Users");
}
