/*
 * Getter/setter creators for model definitions.
 */

const createStringGetter = (field) => {
  return function () {
    const value = this.getDataValue(field);
    return value || "";
  };
};

const createStringSetter = (field) => {
  return function (value) {
    this.setDataValue(field, value || null);
  };
};

module.exports = { createStringGetter, createStringSetter };
