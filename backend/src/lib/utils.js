/*
 * Various functions for misc stuff
 */

"use strict";

// Adapted from https://helloacm.com/the-javascript-function-to-compare-version-number-strings/
const compareVersion = (a, b) => {
  if (typeof a !== "string") return false;
  if (typeof b !== "string") return false;
  if (a.match(/[^.\d]/) || b.match(/[^.\d]/)) {
    return a.localeCompare(b);
  }
  a = a.split(".");
  b = b.split(".");
  const k = Math.min(a.length, b.length);
  for (let i = 0; i < k; ++i) {
    a[i] = parseInt(a[i], 10);
    b[i] = parseInt(b[i], 10);
    if (a[i] > b[i]) return 1;
    if (a[i] < b[i]) return -1;
  }
  return a.length == b.length ? 0 : a.length < b.length ? -1 : 1;
};

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

const objectifyError = (error) => {
  return {
    name: error.name,
    message: error.message,
  };
};

// Taken from https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore
// to replace usage of lodash.
const sortBy = (key) => {
  return (a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0);
};

// Scan the array of ordering fields for any of the specified names. Those
// will be aggregate columns and need to be replaced by "sequelize.literal()".
const fixAggregateOrderFields = (sequelize, arr, fields) => {
  return arr.map((elt) => {
    if (Array.isArray(elt)) {
      if (fields.includes(elt[0])) {
        elt[0] = sequelize.literal(elt[0]);
      }
    } else {
      if (fields.includes(elt)) {
        elt = sequelize.literal(elt);
      }
    }

    return elt;
  });
};

// Fix up the "order" parameter from the flat array of strings into an array
// that has nested arrays when an ordering field has a direction included.
const fixupOrderField = (order) => {
  return order.map((str) => {
    const vals = str.split(",");
    return vals.length === 1 ? vals[0] : vals;
  });
};

module.exports = {
  compareVersion,
  createStringGetter,
  createStringSetter,
  objectifyError,
  sortBy,
  fixAggregateOrderFields,
  fixupOrderField,
};
