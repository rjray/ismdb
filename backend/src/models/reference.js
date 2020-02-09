"use strict"

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
        get: function() {
          let value = this.getDataValue("type")
          return value ? value : ""
        },
      },
      isbn: {
        type: DataTypes.STRING(15),
        get: function() {
          let value = this.getDataValue("language")
          return value ? value : ""
        },
      },
      language: {
        type: DataTypes.STRING(50),
        get: function() {
          let value = this.getDataValue("language")
          return value ? value : ""
        },
      },
      keywords: {
        type: DataTypes.STRING(1000),
        get: function() {
          let value = this.getDataValue("keywords")
          return value ? value : ""
        },
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
