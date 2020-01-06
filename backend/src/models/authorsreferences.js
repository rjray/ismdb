"use strict"

module.exports = sequelize => {
  const AuthorsReferences = sequelize.define(
    "AuthorsReferences",
    {
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false },
  )

  return AuthorsReferences
}
