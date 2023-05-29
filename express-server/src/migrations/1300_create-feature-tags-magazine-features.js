/*
  Database set-up/tear-down for FeatureTagsMagazineFeatures table.
 */

export async function up(queryInterface, Sequelize) {
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
        key: "referenceId",
      },
      onDelete: "CASCADE",
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("FeatureTagsMagazineFeatures");
}
