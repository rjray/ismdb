/*
  ReferenceType model definition.
 */

import { Model } from "sequelize";

export default (sequelize, DataTypes, { ReferenceType: fields }) => {
  class ReferenceType extends Model {
    static associate(models) {
      ReferenceType.hasMany(models.Reference);
    }

    clean() {
      const result = this.get();

      if (result.References)
        result.references = result.References.map((r) => r.clean());
      delete result.References;

      return result;
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
