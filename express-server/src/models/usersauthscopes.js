/*
  UsersAuthScopes relational model definition.
 */

export default (sequelize) => {
  const UsersAuthScopes = sequelize.define(
    "UsersAuthScopes",
    {},
    { timestamps: false }
  );

  return UsersAuthScopes;
};
