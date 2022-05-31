/*
  Book model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { Book: fields }) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.Reference);
      Book.belongsTo(models.Publisher);
      Book.belongsTo(models.Series);
    }

    clean() {
      const result = this.get();

      delete result.ReferenceId;

      if (result.Series) result.series = result.Series.clean();
      delete result.Series;
      delete result.SeriesId;
      if (result.Publisher) result.publisher = result.Publisher.clean();
      delete result.Publisher;
      delete result.PublisherId;

      return result;
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
