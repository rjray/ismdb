/*
  FeatureTagsMagazineFeatures relational model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize) => {
  class FeatureTagsMagazineFeatures extends Model {}

  FeatureTagsMagazineFeatures.init(
    {},
    {
      sequelize,
      modelName: "FeatureTagsMagazineFeatures",
      timestamps: false,
    }
  );

  return FeatureTagsMagazineFeatures;
};
