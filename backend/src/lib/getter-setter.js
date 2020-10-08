/*
 * Getter/setter creators for model definitions.
 */

"use strict";

const createStringGetter = (field) => {
  return function () {
    let value = this.getDataValue(field);
    return value || "";
  };
};

const createStringSetter = (field) => {
  return function (value) {
    this.setDataValue(field, value || null);
  };
};

module.exports = { createStringGetter, createStringSetter };
