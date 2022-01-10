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
