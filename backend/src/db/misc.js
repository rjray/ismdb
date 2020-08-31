/*
 * Miscellaneous queries that don't fit a single theme.
 */

const { Op } = require("sequelize");

const { RecordType, Reference, Sequelize } = require("../models");

// Fetch all RecordType entities.
const fetchAllRecordTypes = async (opts = {}) => {
  return RecordType.findAll({ ...opts });
};

// Fetch all distinct languages referred to in references.
const fetchAllLanguages = async (opts = {}) => {
  const preferred = opts.preferred || "English";

  const results = await Reference.findAll({
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

  const languages = results.map((l) => l.language);
  languages.unshift(preferred);
  return languages;
};

module.exports = {
  fetchAllRecordTypes,
  fetchAllLanguages,
};
