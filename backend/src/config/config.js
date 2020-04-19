require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  development: {
    dialect: "sqlite",
    storage: "mymodb.db",
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    logging: false,
  },
};
