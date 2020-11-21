const {
  createStringGetter,
  createStringSetter,
} = require("../lib/getter-setter");

module.exports = (sequelize, DataTypes) => {
  const Reference = sequelize.define(
    "Reference",
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(75),
        allowNull: false,
      },
      isbn: {
        type: DataTypes.STRING(15),
        get: createStringGetter("isbn"),
        set: createStringSetter("isbn"),
      },
      language: {
        type: DataTypes.STRING(50),
        get: createStringGetter("language"),
        set: createStringSetter("language"),
      },
    },
    {}
  );
  Reference.associate = function (models) {
    Reference.belongsTo(models.RecordType);
    Reference.belongsTo(models.MagazineIssue, { onDelete: "CASCADE" });
    Reference.belongsToMany(models.Author, {
      as: "Authors",
      through: { model: models.AuthorsReferences },
      foreignKey: "referenceId",
    });
    Reference.belongsToMany(models.Tag, {
      as: "Tags",
      through: { model: models.TagsReferences },
      foreignKey: "referenceId",
    });
  };

  return Reference;
};
