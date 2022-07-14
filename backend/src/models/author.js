/*
  Author model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { Author: fields }) => {
  class Author extends Model {
    static associate(models) {
      Author.hasMany(models.AuthorAlias);
      Author.belongsToMany(models.Reference, {
        as: "References",
        through: { model: models.AuthorsReferences },
        foreignKey: "authorId",
      });
    }

    clean() {
      const result = this.get();

      // The two dates are Date objects, convert them to strings.
      for (const date of ["createdAt", "updatedAt"]) {
        result[date] = result[date].toISOString();
      }

      if (result.AuthorAliases)
        result.aliases = result.AuthorAliases.map((a) => a.clean());
      delete result.AuthorAliases;
      if (result.References)
        result.references = result.References.map((r) => r.clean());
      delete result.References;
      if (result.AuthorsReferences) delete result.AuthorsReferences;

      return result;
    }
  }

  Author.init(
    {
      name: {
        type: DataTypes.STRING(fields.name),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Author",
    }
  );

  return Author;
};
