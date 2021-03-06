module.exports = (sequelize, DataTypes) => {
  const MagazineIssue = sequelize.define(
    "MagazineIssue",
    {
      number: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {}
  );
  MagazineIssue.associate = function (models) {
    MagazineIssue.belongsTo(models.Magazine, { onDelete: "CASCADE" });
    MagazineIssue.hasMany(models.Reference);
  };

  return MagazineIssue;
};
