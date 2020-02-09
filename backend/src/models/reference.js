"use strict"

const { createStringGetter, createStringSetter } = require("../lib/utils")

module.exports = (sequelize, DataTypes) => {
  const Reference = sequelize.define(
    "Reference",
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(75),
        get: createStringGetter("type"),
        set: createStringSetter("type"),
      },
      isbn: {
        type: DataTypes.STRING(15),
        get: createStringGetter("isbn"),
        set: createStringSetter("isbn"),
      },
      language: {
        type: DataTypes.STRING(50),
        get: createStringGetter("language"),
        set: createStringSetter("language"),
      },
      keywords: {
        type: DataTypes.STRING(2000),
        get: createStringGetter("keywords"),
        set: createStringSetter("keywords"),
      },
    },
    {}
  )
  Reference.associate = function(models) {
    Reference.belongsTo(models.RecordType)
    Reference.belongsTo(models.MagazineIssue)
    Reference.belongsToMany(models.Author, {
      as: "Authors",
      through: { model: models.AuthorsReferences },
      foreignKey: "referenceId",
    })
  }

  return Reference
}
