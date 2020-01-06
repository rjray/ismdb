"use strict"

module.exports = (sequelize, DataTypes) => {
  const RecordType = sequelize.define(
    "RecordType",
    {
      description: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      notes: DataTypes.STRING(255),
    },
    { timestamps: false },
  )

  return RecordType
}
