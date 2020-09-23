"use strict";

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
      },
      aliases: {
        type: DataTypes.STRING(100),
      },
      notes: {
        type: DataTypes.STRING(1000),
      },
    },
    {}
  );
  Magazine.associate = function (models) {
    Magazine.hasMany(models.MagazineIssue);
  };

  return Magazine;
};
