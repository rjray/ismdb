/*
  This is the exegesis controller module for all series operations (all API
  paths at/below "/series").
 */

const Series = require("../db/series");
const { fixupOrderField, fixupWhereField } = require("../lib/utils");

/*
  POST /series

  Create a new series record from the JSON content in the request body. The
  return value is an object with the key "series" (new series object).
 */

/*
  GET /series

  Return all series (with publisher information), possibly limited by params
  passed in. Also returns a count of all series that match the query, even
  if the query itself is governed by skip and/or limit. The returned object
  has keys "count" (integer) and "series" (list of author objects).
 */
function getAllSeries(context) {
  const { query } = context.params;
  const { res } = context;

  if (query.order) {
    query.order = fixupOrderField(query.order);
  }
  if (query.where) {
    query.where = fixupWhereField(query.where);
  }

  return Series.fetchAllSeriesSimpleWithCount(query)
    .then((results) => {
      res.status(200).pureJson(results);
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        },
      });
    });
}

/*
  GET /series/withReferences

  Return all series (with full information), possibly limited by params
  passed in. Also returns a count of all series that match the query, even
  if the query itself is governed by skip and/or limit. The returned object
  has keys "count" (integer) and "series" (list of author objects).
 */
function getAllSeriesWithReferences(context) {
  const { query } = context.params;
  const { res } = context;

  if (query.order) {
    query.order = fixupOrderField(query.order);
  }
  if (query.where) {
    query.where = fixupWhereField(query.where);
  }

  return Series.fetchAllSeriesCompleteWithCount(query)
    .then((results) => {
      res.status(200).pureJson(results);
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        },
      });
    });
}

/*
  GET /series/{id}

  Get the specified series by the ID.
 */
function getSeriesById(context) {
  const { id } = context.params.path;
  const { res } = context;

  return Series.fetchSingleSeriesSimple(id)
    .then((series) => {
      if (series) {
        res.status(200).pureJson({ series });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No series with this ID (${id}) found`,
          },
        });
      }
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        },
      });
    });
}

/*
  GET /series/{id}

  Get the specified series by the ID.
 */
function getSeriesByIdWithReferences(context) {
  const { id } = context.params.path;
  const { res } = context;

  return Series.fetchSingleSeriesComplete(id)
    .then((series) => {
      if (series) {
        res.status(200).pureJson({ series });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No series with this ID (${id}) found`,
          },
        });
      }
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        },
      });
    });
}

module.exports = {
  getAllSeries,
  getAllSeriesWithReferences,
  getSeriesById,
  getSeriesByIdWithReferences,
};
