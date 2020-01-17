"use strict"

module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define(
    "Author",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      aliases: DataTypes.STRING(1000),
    },
    { timestamps: false },
  )
  Author.associate = function(models) {
    Author.belongsToMany(models.Reference, {
      as: "References",
      through: { model: models.AuthorsReferences },
      foreignKey: "authorId",
    })
  }

  return Author
}
