module.exports = (sequelize) => {
  const AuthorsReferences = sequelize.define(
    "AuthorsReferences",
    {},
    {
      timestamps: false,
    }
  );

  return AuthorsReferences;
};
