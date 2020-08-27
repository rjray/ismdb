"use strict";

module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define(
    "Author",
    {
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
    },
    {}
  );
  Author.associate = function (models) {
    Author.hasMany(models.AuthorAlias);
    Author.belongsToMany(models.Reference, {
      as: "References",
      through: { model: models.AuthorsReferences },
      foreignKey: "authorId",
    });
  };

  return Author;
};
