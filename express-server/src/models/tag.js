/*
  Tag model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { Tag: fields }) => {
  class Tag extends Model {
    static associate(models) {
      Tag.belongsToMany(models.Reference, {
        as: "References",
        through: { model: models.TagsReferences },
        foreignKey: "tagId",
      });
    }

    clean() {
      const result = this.get();

      if (result.TagsReferences) delete result.TagsReferences;
      if (result.References) {
        result.references = result.References.map((r) => r.clean());
        delete result.References;
      }

      return result;
    }
  }

  Tag.init(
    {
      name: {
        type: DataTypes.STRING(fields.name),
        allowNull: false,
      },
      type: DataTypes.STRING(fields.type),
      description: DataTypes.STRING(fields.description),
    },
    {
      sequelize,
      modelName: "Tag",
      timestamps: false,
    }
  );

  return Tag;
};
