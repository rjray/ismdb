module.exports = (sequelize) => {
  const UsersOAuthScopes = sequelize.define(
    "UsersOAuthScopes",
    {},
    { timestamps: false }
  );

  return UsersOAuthScopes;
};
