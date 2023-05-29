require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const dialect = "sqlite";
const storage = process.env.DB_STORAGE || "ismdb.db";

module.exports = {
  debug: {
    dialect,
    storage,
    logging: console.log,
  },
  development: {
    dialect,
    storage,
    logging: false,
  },
  production: {
    dialect,
    storage,
    logging: false,
  },
};
