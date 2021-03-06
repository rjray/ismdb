/*
 * All database operations that focus on users.
 */

const jwt = require("jsonwebtoken");

const jwtSecrets = {
  access: process.env.ACCESS_TOKEN_SECRET,
  refresh: process.env.REFRESH_TOKEN_SECRET,
};

const { User, AuthScope } = require("../models");

const userIncludes = [{ model: AuthScope, as: "Scopes" }];

const fetchSingleUserById = async (id) => {
  const user = await User.findByPk(id, { include: userIncludes });

  return user?.get();
};

const fetchSingleUserByUsername = async (username) => {
  const user = await User.findOne({
    where: { username },
    include: userIncludes,
  });

  return user?.get();
};

const fetchSingleUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email }, include: userIncludes });

  return user?.get();
};

const createUserJwt = (userIn, role, expiresIn) => {
  const { ...user } = userIn;
  const secret = jwtSecrets[role];

  if (user.Scopes) {
    user.scopes = user.Scopes.reduce((acc, curr) => {
      // eslint-disable-next-line no-param-reassign
      acc[curr.name] = true;
      return acc;
    }, {});
    delete user.Scopes;
  }
  delete user.password;

  return jwt.sign({ user, role }, secret, {
    expiresIn,
    issuer: "ismdb.net",
  });
};

const createUserAccessToken = (user) => createUserJwt(user, "access", "15m");

const createUserRefreshToken = (user) => createUserJwt(user, "refresh", "28d");

module.exports = {
  fetchSingleUserById,
  fetchSingleUserByUsername,
  fetchSingleUserByEmail,
  createUserAccessToken,
  createUserRefreshToken,
};
