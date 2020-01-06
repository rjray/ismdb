"use strict"

module.exports = (sequelize, DataTypes) => {
  const Magazine = sequelize.define(
    "Magazine",
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      language: DataTypes.STRING(50),
      aliases: DataTypes.STRING(100),
      notes: DataTypes.STRING(1000),
    },
    {},
  )
  Magazine.associate = function(models) {
    Magazine.hasMany(models.MagazineIssue)
  }

  return Magazine
}
