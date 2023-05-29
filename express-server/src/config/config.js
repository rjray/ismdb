require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const dialect = "sqlite";
const storage = process.env.DB_STORAGE || "ismdb.db";

export const debug = {
  dialect,
  storage,
  logging: console.log,
};
export const development = {
  dialect,
  storage,
  logging: false,
};
export const test = {
  dialect,
  storage,
  logging: false,
};
export const production = {
  dialect,
  storage,
  logging: false,
};
