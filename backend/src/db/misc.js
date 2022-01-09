/*
 * Miscellaneous queries that don't fit a single theme.
 */

const { Op } = require("sequelize");

const { ReferenceType, Reference, Tag, Sequelize } = require("../models");

// Fetch all ReferenceType entities.
const fetchAllReferenceTypes = async (opts = {}) => {
  const results = await ReferenceType.findAll({ ...opts });
  const referenceTypes = results.map((rt) => rt.get());

  return referenceTypes;
};

// Fetch all distinct languages referred to in references.
const fetchAllLanguages = async (opts = {}) => {
  const preferred = opts.preferred || "English";

  const languagesList = await Reference.findAll({
    attributes: [
      [Sequelize.fn("DISTINCT", Sequelize.col("language")), "language"],
    ],
    where: {
      [Op.and]: [
        {
          language: {
            [Op.ne]: null,
          },
        },
        {
          language: {
            [Op.ne]: "",
          },
        },
        {
          language: {
            [Op.ne]: preferred,
          },
        },
      ],
    },
    order: ["language"],
  });

  const languages = languagesList.map((i) => i.language);
  languages.unshift(preferred);

  return languages;
};

// Fetch all distinct "types" referred to in the tags.
const fetchAllTagTypes = async () => {
  const results = await Tag.findAll({
    attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("type")), "type"]],
    where: {
      [Op.and]: [
        {
          type: {
            [Op.ne]: null,
          },
        },
        {
          type: {
            [Op.ne]: "",
          },
        },
      ],
    },
    order: ["type"],
  });

  const types = results.map((result) => result.type);
  return types;
};

module.exports = {
  fetchAllReferenceTypes,
  fetchAllLanguages,
  fetchAllTagTypes,
};
