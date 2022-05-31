/*
  MagazineFeature model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MagazineFeature extends Model {
    static associate(models) {
      MagazineFeature.belongsTo(models.Reference);
      MagazineFeature.belongsTo(models.MagazineIssue);
      MagazineFeature.belongsToMany(models.FeatureTag, {
        as: "FeatureTags",
        through: { model: models.FeatureTagsMagazineFeatures },
        foreignKey: "magazineFeatureId",
      });
    }

    clean() {
      const result = this.get();

      delete result.ReferenceId;
      if (result.FeatureTags) {
        result.featureTags = result.FeatureTags.map((t) => t.clean());
        delete result.FeatureTags;
      }

      return result;
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
