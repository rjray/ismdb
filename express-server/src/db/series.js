/*
  All database operations that focus on series.
 */

const { Reference, Book, Publisher, Series, sequelize } = require("../models");
const { includesForReference } = require("./references");

// Get a single series with Publisher but no references
const fetchSingleSeriesSimple = async (id) => {
  const series = await Series.findByPk(id, {
    include: [Publisher],
  });

  return series?.clean();
};

// Get a single series with Publisher and all related references. Note that
// this means some heavy post-processing of the data that the "Books" relation
// provides. See `cleanSeriesWithReferences()`.
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

// Fetch all Series records with the Publisher information included. Return
// the data and the count of all matching Series.
const fetchAllSeriesSimpleWithCount = async (opts = {}) => {
  const count = await Series.count(opts);
  const results = await Series.findAll({
    include: [Publisher],
    ...opts,
  });

  const series = results.map((result) => result.clean());

  return { count, series };
};

// Fetch all Series records with the Publisher information and Book information
// included. Return the data and the count of all matching Series.
const fetchAllSeriesCompleteWithCount = async (opts = {}) => {
  const count = await Series.count(opts);
  const results = await Series.findAll({
    include: [
      Publisher,
      {
        model: Book,
        as: "Books",
        include: [{ model: Reference, include: includesForReference }],
      },
    ],
    ...opts,
  });

  const series = results.map((result) => result.clean());

  return { count, series };
};

// Create a new series using the content in data.
const createSeries = async (data) => {
  const series = await Series.create(data).catch((error) => {
    if (error.hasOwnProperty("errors")) {
      const specific = error.errors[0];
      throw new Error(specific.message);
    } else {
      throw new Error(error.message);
    }
  });

  return series.clean();
};

// Update a single series using the content in data.
const updateSeries = async (id, data) => {
  return Series.findByPk(id).then((series) => {
    return sequelize.transaction(async (txn) => {
      const updatedSeries = await series.update(data, { transaction: txn });
      return updatedSeries.clean();
    });
  });
};

// Delete a single Series record.
const deleteSeries = async (id) => {
  return Series.destroy({ where: { id } });
};

module.exports = {
  fetchSingleSeriesSimple,
  fetchSingleSeriesComplete,
  fetchAllSeriesSimpleWithCount,
  fetchAllSeriesCompleteWithCount,
  createSeries,
  updateSeries,
  deleteSeries,
};
