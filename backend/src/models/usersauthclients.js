module.exports = (sequelize) => {
  const UsersAuthClients = sequelize.define(
    "UsersAuthClients",
    {},
    { timestamps: false }
  );

  return UsersAuthClients;
};
