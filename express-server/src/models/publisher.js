/*
  Publisher model definition.
 */

import { Model } from "sequelize";

export default (sequelize, DataTypes, { Publisher: fields }) => {
  class Publisher extends Model {
    static associate(models) {
      Publisher.hasMany(models.Book);
      Publisher.hasMany(models.Series);
    }

    clean() {
      const result = this.get();

      if (result.Books) result.books = result.Books.map((b) => b.clean());
      delete result.Books;
      if (result.Series) result.series = result.Series.map((s) => s.clean());
      delete result.Series;

      return result;
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
