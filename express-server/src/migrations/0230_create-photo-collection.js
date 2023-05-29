/*
  Database set-up/tear-down for PhotoCollections table.
 */

/* eslint-disable import/no-dynamic-require */
const { PhotoCollection } = require(`${__dirname}/../config/string_fields`);

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("PhotoCollections", {
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
    location: {
      type: Sequelize.STRING(PhotoCollection.location),
      allowNull: false,
    },
    media: {
      type: Sequelize.STRING(PhotoCollection.media),
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("PhotoCollections");
}
