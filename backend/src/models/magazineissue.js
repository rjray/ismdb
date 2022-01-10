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
