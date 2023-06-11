/*
  MagazineIssue model definition.
 */

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes, { MagazineIssue: fields }) => {
  class MagazineIssue extends Model {
    static associate(models) {
      MagazineIssue.belongsTo(models.Magazine);
      MagazineIssue.hasMany(models.MagazineFeature);
    }

    clean() {
      const result = this.get();

      // The two dates are Date objects, convert them to ISO strings so that
      // they don't stringify automatically.
      for (const date of ["createdAt", "updatedAt"]) {
        if (result.hasOwnProperty(date))
          result[date] = result[date].toISOString();
      }

      if (result.MagazineId) delete result.MagazineId;
      if (result.Magazine) {
        result.magazine = result.Magazine.clean();
        delete result.Magazine;
      }
      if (result.MagazineFeatures) {
        result.magazineFeatures = result.MagazineFeatures.map((m) => m.clean());
        delete result.MagazineFeatures;
      }

      return result;
    }
  }

  MagazineIssue.init(
    {
      issue: {
        type: DataTypes.STRING(fields.issue),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MagazineIssue",
    }
  );

  return MagazineIssue;
};
