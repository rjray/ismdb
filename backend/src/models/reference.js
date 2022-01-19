/*
  Reference model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { Reference: fields }) => {
  class Reference extends Model {
    static associate(models) {
      Reference.belongsTo(models.ReferenceType);
      Reference.hasOne(models.Book);
      Reference.hasOne(models.MagazineFeature);
      Reference.hasOne(models.PhotoCollection);
      Reference.belongsToMany(models.Author, {
        as: "Authors",
        through: { model: models.AuthorsReferences },
        foreignKey: "referenceId",
      });
      Reference.belongsToMany(models.Tag, {
        as: "Tags",
        through: { model: models.TagsReferences },
        foreignKey: "referenceId",
      });
    }
  }

  Reference.init(
    {
      name: {
        type: DataTypes.STRING(fields.name),
        allowNull: false,
      },
      language: DataTypes.STRING(fields.language),
    },
    {
      sequelize,
      modelName: "Reference",
    }
  );

  return Reference;
};
