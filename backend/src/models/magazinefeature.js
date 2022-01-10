/*
  MagazineFeature model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MagazineFeature extends Model {
    static associate(models) {
      MagazineFeature.belongsTo(models.MagazineIssue);
      MagazineFeature.belongsToMany(models.FeatureTag, {
        as: "FeatureTags",
        through: { model: models.FeatureTagsMagazineFeatures },
        foreignKey: "magazineFeatureId",
      });
    }
  }

  MagazineFeature.init(
    {
      referenceId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "MagazineFeature",
      timestamps: false,
    }
  );

  return MagazineFeature;
};
