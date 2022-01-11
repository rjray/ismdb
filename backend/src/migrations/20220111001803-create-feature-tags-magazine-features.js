/*
  Database set-up/tear-down for FeatureTagsMagazineFeatures table.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("FeatureTagsMagazineFeatures", {
      featureTagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "FeatureTags",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      magazineFeatureId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "MagazineFeatures",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("FeatureTagsMagazineFeatures");
  },
};
