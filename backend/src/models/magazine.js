/*
  Magazine model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { Magazine: fields }) => {
  class Magazine extends Model {
    static associate(models) {
      Magazine.hasMany(models.MagazineIssue);
    }

    clean() {
      const result = this.get();

      // The two dates are Date objects, convert them to strings.
      for (const date of ["createdAt", "updatedAt"]) {
        result[date] = result[date].toISOString();
      }

      if (result.MagazineIssues) {
        result.magazineIssues = result.MagazineIssues.map((i) => i.clean());
        delete result.MagazineIssues;
      }

      return result;
    }
  }

  Magazine.init(
    {
      name: {
        type: DataTypes.STRING(fields.name),
        allowNull: false,
      },
      language: DataTypes.STRING(fields.language),
      aliases: DataTypes.STRING(fields.aliases),
      notes: DataTypes.STRING(fields.notes),
    },
    {
      sequelize,
      modelName: "Magazine",
    }
  );

  return Magazine;
};
