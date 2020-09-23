/*
 * Various functions for misc stuff
 */

"use strict";

const { Op } = require("sequelize");
const { sequelize } = require("../models");

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

// Fix up the "where" parameter from the flat array of strings into a keyed
// nested object for the clauses.
const fixupWhereField = (where, canBeNull = new Set()) => {
  const value = where.reduce((acc, clause) => {
    const vals = clause.split(",");
    if (vals.length === 1) {
      acc.push({ [vals[0]]: { [Op.not]: null } });
    } else if (vals.length === 2) {
      acc.push({ [vals[0]]: { [Op.eq]: vals[1] } });
    } else {
      if (!Op.hasOwnProperty(vals[1]))
        throw new Error(`Unknown operand '${vals[1]}'`);

      const val = vals.length > 3 ? vals.slice(2) : vals[2];
      if (canBeNull.has(vals[0]) && (vals[1] === "ne" || vals[1] === "notIn")) {
        acc.push(
          sequelize.where(
            sequelize.fn("COALESCE", sequelize.col(vals[0]), ""),
            Op[vals[1]],
            val
          )
        );
      } else {
        acc.push({ [vals[0]]: { [Op[vals[1]]]: val } });
      }
    }

    return acc;
  }, []);

  return { [Op.and]: value };
};

module.exports = {
  compareVersion,
  objectifyError,
  sortBy,
  fixAggregateOrderFields,
  fixupOrderField,
  fixupWhereField,
};
