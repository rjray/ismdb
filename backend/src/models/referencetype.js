/*
  ReferenceType model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { ReferenceType: fields }) => {
  class ReferenceType extends Model {
    static associate(models) {
      ReferenceType.hasMany(models.Reference);
    }
  }

  ReferenceType.init(
    {
      name: {
        type: DataTypes.STRING(fields.name),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(fields.description),
        allowNull: false,
      },
      notes: DataTypes.STRING(fields.notes),
    },
    {
      sequelize,
      modelName: "ReferenceType",
      timestamps: false,
    }
  );

  return ReferenceType;
};
