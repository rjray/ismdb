/*
 * All database operations that focus on users.
 */

const jwt = require("jsonwebtoken");

const { User, AuthClient, AuthScope } = require("../models");

const userIncludes = [
  { model: AuthClient, as: "Clients" },
  { model: AuthScope, as: "Scopes" },
];

const fetchSingleUserById = async (id) => {
  const user = await User.findByPk(id, { include: userIncludes });

  return user?.get();
};

const fetchSingleUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email }, include: userIncludes });

  return user?.get();
};

const createUserAccessToken = (userIn, client) => {
  const { Clients: clients, ...user } = userIn;

  delete user.password;
  user.scopes = user.Scopes.map(({ name }) => name);
  delete user.Scopes;

  return jwt.sign({ user }, client.secret, {
    expiresIn: "5m",
    issuer: "ismdb",
  });
};

const createUserRefreshToken = (user, client) => {
  const { id, name, email } = user;

  return jwt.sign({ user: { id, name, email } }, client.secret, {
    expiresIn: "7d",
    issuer: "ismdb",
  });
};

module.exports = {
  fetchSingleUserById,
  fetchSingleUserByEmail,
  createUserAccessToken,
  createUserRefreshToken,
};
