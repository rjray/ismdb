"use strict";

module.exports = (sequelize, DataTypes) => {
  const RecordType = sequelize.define(
    "RecordType",
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING(255),
      },
    },
    { timestamps: false }
  );

  return RecordType;
};
