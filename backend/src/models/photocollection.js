/*
  PhotoCollection model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { PhotoCollection: fields }) => {
  class PhotoCollection extends Model {}

  PhotoCollection.init(
    {
      referenceId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      location: {
        type: DataTypes.STRING(fields.location),
        allowNull: false,
      },
      media: {
        type: DataTypes.STRING(fields.media),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PhotoCollection",
      timestamps: false,
    }
  );

  return PhotoCollection;
};
