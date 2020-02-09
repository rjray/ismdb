"use strict"

module.exports = (sequelize, DataTypes) => {
  const RecordType = sequelize.define(
    "RecordType",
    {
      description: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING(255),
        get: function() {
          let value = this.getDataValue("notes")
          return value ? value : ""
        },
      },
    },
    { timestamps: false }
  )

  return RecordType
}
