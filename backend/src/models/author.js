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
