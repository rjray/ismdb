"use strict";

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      name: {
        type: DataTypes.STRING(75),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(255),
        defaultValue: "",
      },
      type: {
        type: DataTypes.STRING(15),
        defaultValue: "",
      },
    },
    { timestamps: false }
  );
  Tag.associate = function (models) {
    Tag.belongsToMany(models.Reference, {
      as: "References",
      through: { model: models.TagsReferences },
      foreignKey: "tagId",
    });
  };

  return Tag;
};
