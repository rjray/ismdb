/*
  Database set-up/tear-down for FeatureTags table.
 */

/* eslint-disable import/no-dynamic-require */
const { FeatureTag } = require(`${__dirname}/../config/string_fields`);

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("FeatureTags");
  },
};
