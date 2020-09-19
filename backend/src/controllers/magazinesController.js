"use strict";

/*
  This is the exegesis controller module for all magazine operations (all API
  paths at/below "/magazine").
 */

const magazines = require("../db/magazines");

/*
  POST /magazines

  Create a new magazine record from the content in the request body. The
  return value is an object with the keys "magazine" (new magazine) and
  "notifications" (array of notification objects, usually just one element).
 */
function createMagazine(context) {
  const { res, requestBody } = context;

  return magazines
    .createMagazine(requestBody)
    .then((magazine) => {
      res.status(201).pureJson({ magazine });
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
  GET /magazines

  Returns all magazine titles, with count of total issues per magazine. Return
  value is an object with keys "count" (the count of all magazine titles) and
  "magazines", an array of the magazines themselves. The returned list may be
  governed by parameters in the query. If so, the count will reflect all
  records that match the query, regardless of "limit" or "skip".
 */
function getAllMagazines(context) {
  const query = context.params.query;
  const res = context.res;

  return magazines
    .fetchAllMagazinesWithIssueCountAndCount()
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
  GET /magazines/withIssues

  Returns all magazine titles with nested issue information. Return value is an
  object with keys "count" (the count of all magazine titles) and "magazines",
  an array of the magazines themselves. The returned list may be governed by
  parameters in the query. If so, the count will reflect all records that match
  the query, regardless of "limit" or "skip".
 */
function getAllMagazinesWithIssues(context) {
  const query = context.params.query;
  const res = context.res;

  return magazines
    .fetchAllMagazinesWithIssueNumbersAndCount()
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
  GET /magazines/{id}

  Fetch a single magazine title by ID. Return value is an object with the keys
  "magazine" (the magazine record) and (possibly) "notifications" (any notes
  from the operation).
 */
function getMagazineById(context) {
  const id = context.params.path.id;
  const res = context.res;

  return magazines
    .fetchSingleMagazineSimple(id)
    .then((magazine) => {
      if (magazine) {
        res.status(200).pureJson({ magazine });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No magazine with this ID (${id}) found`,
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
  PUT /magazines/{id}

  Update a single magazine title record by the ID, using the JSON content in
  the request body. Return value is an object with keys "magazine" (the
  updated magazine record) and "notifications".
 */
function updateMagazineById(context) {
  const id = context.params.path.id;
  const { res, requestBody } = context;

  return magazines
    .updateMagazine(id, requestBody)
    .then((magazine) => {
      if (magazine) {
        res.status(200).pureJson({ magazine });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No magazine with this ID (${id}) found`,
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
  DELETE /magazines/{id}

  Delete the magazine specified by the ID parameter. The return value is an
  object with a single key, "notifications" (an array of notification objects,
  usually just one element in this case).
 */
function deleteMagazineById(context) {
  const id = context.params.path.id;
  const res = context.res;

  return magazines
    .deleteMagazine(id)
    .then((number) => {
      if (number) {
        res.status(200).pureJson({});
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No magazine with this ID (${id}) found`,
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
  GET /magazines/{id}/withIssues

  Fetch a single magazine title by ID, with issues and per-issue references.
  Return value is an object with the keys "magazine" (the magazine record) and
  (possibly) "notifications" (any notes from the operation).
 */
function getMagazineByIdWithIssues(context) {
  const id = context.params.path.id;
  const res = context.res;

  return magazines
    .fetchSingleMagazineComplete(id)
    .then((magazine) => {
      if (magazine) {
        res.status(200).pureJson({ magazine });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No magazine with this ID (${id}) found`,
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
  createMagazine,
  getAllMagazines,
  getAllMagazinesWithIssues,
  getMagazineById,
  updateMagazineById,
  deleteMagazineById,
  getMagazineByIdWithIssues,
};
