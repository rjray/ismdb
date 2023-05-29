/*
  This is the entry point for the "models" sub-module. This dynamically loads
  all the model classes (in this directory) and builds an object containing
  the models (along with pointers to the instantiated Sequelize instance and
  the Sequelize pointer itself). This was originally created by the
  sequelize-cli application, but is pretty heavily-modified at this point.
 */

/* eslint-disable import/no-dynamic-require */
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const fields = require(`${__dirname}/../config/string_fields`);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(`${__dirname}/../config/config`)[env];
const db = {};

const sequelize = new Sequelize(config);

fs.readdirSync(__dirname)
  .filter((file) => file !== basename && file.slice(-3) === ".js")
  .forEach((file) => {
    // eslint-disable-next-line global-require
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
      fields
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
