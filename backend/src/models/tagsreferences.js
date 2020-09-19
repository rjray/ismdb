"use strict";

module.exports = (sequelize) => {
  const TagsReferences = sequelize.define(
    "TagsReferences",
    {},
    { timestamps: false }
  );

  return TagsReferences;
};
