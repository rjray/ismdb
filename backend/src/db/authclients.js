/*
 * All database operations that focus on auth clients.
 */

const { AuthClient } = require("../models");

const fetchSingleAuthClientById = async (id, opts = {}) => {
  const authclient = await AuthClient.findByPk(id, opts);

  return authclient?.get();
};

const fetchSingleAuthClientByName = async (name, opts = {}) => {
  const authclient = await AuthClient.findOne({ where: { name }, ...opts });

  return authclient?.get();
};

module.exports = {
  fetchSingleAuthClientById,
  fetchSingleAuthClientByName,
};
