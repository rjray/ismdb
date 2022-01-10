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
      isbn: DataTypes.STRING(fields.isbn),
    },
    {
      sequelize,
      modelName: "Book",
      timestamps: false,
    }
  );
  return Book;
};
