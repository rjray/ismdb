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

    clean() {
      const result = this.get();

      // There's always a reference-type.
      result.referenceType = result.ReferenceType.clean();
      delete result.ReferenceType;

      for (const type of ["Book", "MagazineFeature", "PhotoCollection"]) {
        if (result[type]) {
          const lc = type.substring(0, 1).toLowerCase() + type.substring(1);
          result[lc] = result[type].clean();
        }
        delete result[type];
      }
      if (result.Authors) {
        result.authors = result.Authors.map((a) => a.clean());
        delete result.Authors;
      }
      if (result.Tags) {
        result.tags = result.Tags.map((t) => t.clean());
        delete result.Tags;
      }

      return result;
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
