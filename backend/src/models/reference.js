"use strict"

module.exports = (sequelize, DataTypes) => {
  const Reference = sequelize.define(
    "Reference",
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type: DataTypes.STRING(75),
      isbn: DataTypes.STRING(15),
      language: DataTypes.STRING(50),
      keywords: DataTypes.STRING(1000),
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
