/*
  Book model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { Book: fields }) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.Publisher);
      Book.belongsTo(models.Series);
    }
  }

  Book.init(
    {
      referenceId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      isbn: DataTypes.STRING(fields.isbn),
      seriesNumber: DataTypes.STRING(fields.seriesNumber),
    },
    {
      sequelize,
      modelName: "Book",
      timestamps: false,
    }
  );
  return Book;
};
