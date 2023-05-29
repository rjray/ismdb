/*
  Read the YAML file of the string-field sizes and export the resulting object.
 */

import { load } from "js-yaml";
import { readFileSync } from "fs";

export default load(readFileSync(`${__dirname}/string_fields.yaml`, "utf8"));
