const {
  createStringGetter,
  createStringSetter,
} = require("../lib/getter-setter");

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
        get: createStringGetter("notes"),
        set: createStringSetter("notes"),
      },
    },
    { timestamps: false }
  );

  return RecordType;
};
