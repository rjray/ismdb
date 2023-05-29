/*
  Publisher model definition.
 */

import { Model } from "sequelize";

export default (sequelize, DataTypes, { Series: fields }) => {
  class Series extends Model {
    static associate(models) {
      Series.belongsTo(models.Publisher);
      Series.hasMany(models.Book);
    }

    clean() {
      const result = this.get();

      if (result.Books) result.books = result.Books.map((b) => b.clean());
      delete result.Books;
      if (result.Publisher) result.publisher = result.Publisher.clean();
      delete result.Publisher;
      delete result.PublisherId;

      return result;
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
