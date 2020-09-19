"use strict";

/*
  This is the exegesis controller module for all magazine issue operations (all
  API paths at/below "/issue").
 */

const magazines = require("../db/magazines");

/*
  POST /issues

  Create a new magazine issue record from the content in the request body. The
  return value is an object with the keys "magazineissue" (new magazine issue)
  and "notifications" (array of notification objects, usually just one
  element).
 */
function createMagazineIssue(context) {
  const { res, requestBody } = context;

  return magazines
    .createMagazineIssue(requestBody)
    .then((magazineissue) => {
      res.status(201).pureJson({ magazineissue });
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
  GET /issues/{id}

  Retrieve a single magazine issue record by ID from the database, with all the
  associated references. Returns an object with a single key, "magazineissue",
  that is the magazine issue data with an extra field ("referemces") containing
  an array of reference objects.
 */
function getMagazineIssueById(context) {
  const id = context.params.path.id;
  const res = context.res;

  return magazines
    .fetchSingleMagazineIssueComplete(id)
    .then((magazineissue) => {
      if (magazineissue) {
        res.status(200).pureJson({ magazineissue });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No issue with this ID (${id}) found`,
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
  PUT /issues/{id}

  Update the magazine issue record indicated by the ID parameter, using the
  content of the request body. Return value is an object with the keys
  "magazineissue" (the updated issue record) and "notifications".
 */
function updateMagazineIssueById(context) {
  const id = context.params.path.id;
  const { res, requestBody } = context;

  return magazines
    .updateMagazineIssue(id, requestBody)
    .then((magazineissue) => {
      if (magazineissue) {
        res.status(200).pureJson({ magazineissue });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No issue with this ID (${id}) found`,
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
  DELETE /issues/{id}

  Delete the magazine issue record indicated by the ID parameter. Returns an
  object with one key, "notifications".
 */
function deleteMagazineIssueById(context) {
  const id = context.params.path.id;
  const res = context.res;

  return magazines
    .deleteMagazineIssue(id)
    .then((number) => {
      if (number) {
        res.status(200).pureJson({});
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No issue with this ID (${id}) found`,
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
  createMagazineIssue,
  getMagazineIssueById,
  updateMagazineIssueById,
  deleteMagazineIssueById,
};
