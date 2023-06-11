/*
  FeatureTag model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { FeatureTag: fields }) => {
  class FeatureTag extends Model {
    static associate(models) {
      FeatureTag.belongsToMany(models.MagazineFeature, {
        as: "MagazineFeatures",
        through: { model: models.FeatureTagsMagazineFeatures },
        foreignKey: "featureTagId",
      });
    }

    clean() {
      const result = this.get();

      delete result.FeatureTagsMagazineFeatures;
      if (result.MagazineFeatures) {
        result.magazineFeatures = result.MagazineFeatures.map((f) => f.clean());
        delete result.MagazineFeatures;
      }

      return result;
    }
  }

  FeatureTag.init(
    {
      name: {
        type: DataTypes.STRING(fields.name),
        allowNull: false,
      },
      description: DataTypes.STRING(fields.description),
    },
    {
      sequelize,
      modelName: "FeatureTag",
      timestamps: false,
    }
  );

  return FeatureTag;
};
