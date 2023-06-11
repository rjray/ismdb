/*
  PhotoCollection model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { PhotoCollection: fields }) => {
  class PhotoCollection extends Model {
    static associate(models) {
      PhotoCollection.belongsTo(models.Reference);
    }

    clean() {
      const result = this.get();

      delete result.ReferenceId;
      if (result.Reference) {
        result.reference = result.Reference.clean();
        delete result.Reference;
      }

      return result;
    }
  }

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
