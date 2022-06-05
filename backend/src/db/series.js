/*
  All database operations that focus on series.
 */

const { Book, Publisher, Reference, Series } = require("../models");
const { includesForReference } = require("./references");

// Get a single series with Publisher but no references
const fetchSingleSeriesSimple = async (id) => {
  const series = await Series.findByPk(id, {
    include: [Publisher],
  });

  return series?.clean();
};

const fetchSingleSeriesComplete = async (id) => {
  const series = await Series.findByPk(id, {
    include: [
      Publisher,
      {
        model: Book,
        as: "Books",
        include: [{ model: Reference, include: includesForReference }],
      },
    ],
  });

  return series?.clean();
};

module.exports = {
  fetchSingleSeriesSimple,
  fetchSingleSeriesComplete,
};
