/*
  Read the YAML file of the string-field sizes and export the resulting object.
 */

const yaml = require("js-yaml");
const fs = require("fs");

module.exports = yaml.load(
  fs.readFileSync(`${__dirname}/string_fields.yaml`, "utf8")
);
