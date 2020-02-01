"use strict"

module.exports = (sequelize, DataTypes) => {
  const AuthorAlias = sequelize.define(
    "AuthorAlias",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    { timestamps: false }
  )
  AuthorAlias.associate = function(models) {
    AuthorAlias.belongsTo(models.Author)
  }
  return AuthorAlias
}
