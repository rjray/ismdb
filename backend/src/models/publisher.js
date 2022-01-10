/*
  Publisher model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { Publisher: fields }) => {
  class Publisher extends Model {
    static associate(models) {
      Publisher.hasMany(models.Book);
      Publisher.hasMany(models.Series);
    }
  }

  Publisher.init(
    {
      name: {
        type: DataTypes.STRING(fields.name),
        allowNull: false,
      },
      notes: DataTypes.STRING(fields.notes),
    },
    {
      sequelize,
      modelName: "Publisher",
      timestamps: false,
    }
  );

  return Publisher;
};
