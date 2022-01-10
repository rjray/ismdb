/*
  Publisher model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { Series: fields }) => {
  class Series extends Model {
    static associate(models) {
      Series.belongsTo(models.Publisher);
      Series.hasMany(models.Book);
    }
  }

  Series.init(
    {
      name: {
        type: DataTypes.STRING(fields.name),
        allowNull: false,
      },
      notes: DataTypes.STRING(fields.notes),
    },
    {
      sequelize,
      modelName: "Series",
      timestamps: false,
    }
  );

  return Series;
};
