/*
  Database set-up/tear-down for FeatureTags table.
 */

/* eslint-disable import/no-dynamic-require */
const { FeatureTag } = require(`${__dirname}/../config/string_fields`);

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("FeatureTags", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING(FeatureTag.name),
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.STRING(FeatureTag.description),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("FeatureTags");
}
