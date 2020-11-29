module.exports = (sequelize) => {
  const UsersOAuthClients = sequelize.define(
    "UsersOAuthClients",
    {},
    { timestamps: false }
  );

  return UsersOAuthClients;
};
