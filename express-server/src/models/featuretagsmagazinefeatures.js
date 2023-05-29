/*
  FeatureTagsMagazineFeatures relational model definition.
 */

import { Model } from "sequelize";

export default (sequelize) => {
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
