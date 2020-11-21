const {
  createStringGetter,
  createStringSetter,
} = require("../lib/getter-setter");

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      name: {
        type: DataTypes.STRING(75),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(255),
        get: createStringGetter("description"),
        set: createStringSetter("description"),
      },
      type: {
        type: DataTypes.STRING(25),
        get: createStringGetter("type"),
        set: createStringSetter("type"),
      },
    },
    { timestamps: false }
  );
  Tag.associate = function (models) {
    Tag.belongsToMany(models.Reference, {
      as: "References",
      through: { model: models.TagsReferences },
      foreignKey: "tagId",
    });
  };

  return Tag;
};
