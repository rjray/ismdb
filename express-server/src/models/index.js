/*
  This is the entry point for the "models" sub-module. This dynamically loads
  all the model classes (in this directory) and builds an object containing
  the models (along with pointers to the instantiated Sequelize instance and
  the Sequelize pointer itself). This was originally created by the
  sequelize-cli application, but is pretty heavily-modified at this point.
 */

/* eslint-disable import/no-dynamic-require */
import { readdirSync } from "fs";
import { basename as _basename, join } from "path";
import Sequelize, { DataTypes } from "sequelize";

const fields = require(`${__dirname}/../config/string_fields`);

const basename = _basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(`${__dirname}/../config/config`)[env];

const sequelize = new Sequelize(config);
const db = { Sequelize, sequelize };

readdirSync(__dirname)
  .filter((file) => file !== basename && file.slice(-3) === ".js")
  .forEach((file) => {
    // eslint-disable-next-line global-require
    const model = require(join(__dirname, file))(sequelize, DataTypes, fields);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
