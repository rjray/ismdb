/*
  UsersAuthScopes relational model definition.
 */

module.exports = (sequelize) => {
  const UsersAuthScopes = sequelize.define(
    "UsersAuthScopes",
    {},
    { timestamps: false }
  );

  return UsersAuthScopes;
};
