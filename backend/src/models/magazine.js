"use strict"

const { createStringGetter, createStringSetter } = require("../lib/utils")

module.exports = (sequelize, DataTypes) => {
  const Magazine = sequelize.define(
    "Magazine",
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING(50),
        get: createStringGetter("language"),
        set: createStringSetter("language"),
      },
      aliases: {
        type: DataTypes.STRING(100),
        get: createStringGetter("aliases"),
        set: createStringSetter("aliases"),
      },
      notes: {
        type: DataTypes.STRING(1000),
        get: createStringGetter("notes"),
        set: createStringSetter("notes"),
      },
    },
    {}
  )
  Magazine.associate = function(models) {
    Magazine.hasMany(models.MagazineIssue)
  }

  return Magazine
}
