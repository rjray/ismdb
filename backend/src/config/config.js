require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

function getDefines(dialect) {
  let defines;

  switch (dialect) {
    case "mysql":
      defines = {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      };
      break;
    default:
      break;
  }

  return defines;
}

const dialect = process.env.DB_DIALECT || "mysql";
const storage = process.env.DB_STORAGE || "ismdb.db";
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;
const host = process.env.DB_HOST;

const define = getDefines(dialect);

module.exports = {
  debug: {
    dialect,
    username,
    password,
    database,
    host,
    storage,
    define,
    logging: console.log,
  },
  development: {
    dialect,
    username,
    password,
    database,
    host,
    storage,
    define,
    logging: false,
  },
  test: {
    dialect,
    username,
    password,
    database,
    host,
    storage,
    define,
    logging: false,
  },
  production: {
    dialect,
    username,
    password,
    database,
    host,
    storage,
    define,
    logging: false,
  },
};
