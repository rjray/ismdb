"use strict"

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
        get: function() {
          let value = this.getDataValue("language")
          return value ? value : ""
        },
      },
      aliases: {
        type: DataTypes.STRING(100),
        get: function() {
          let value = this.getDataValue("aliases")
          return value ? value : ""
        },
      },
      notes: {
        type: DataTypes.STRING(1000),
        get: function() {
          let value = this.getDataValue("notes")
          return value ? value : ""
        },
      },
    },
    {}
  )
  Magazine.associate = function(models) {
    Magazine.hasMany(models.MagazineIssue)
  }

  return Magazine
}
