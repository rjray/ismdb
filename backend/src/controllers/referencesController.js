"use strict";

/*
  This is the exegesis controller module for all reference operations (all API
  paths at/below "/reference").
 */

const references = require("../db/references");
const { fixupOrderField, fixupWhereField } = require("../lib/utils");

const canBeNull = new Set(["isbn", "language"]);

/*
  POST /references

  Create a new reference record from the content in the request body. The
  return value is an object with the keys "reference" (new reference) and
  "notifications" (array of notification objects, usually just one element).
 */
function createReference(context) {
  const { res, requestBody } = context;

  return references
    .createReference(requestBody)
    .then((reference) => {
      res.status(201).pureJson({ reference });
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
  GET /references

  Returns all references with a count of the total number of references. May
  be governed by query parameters, in which case the count will reflect all
  matching records regardless of "skip" or "limit". The return value is an
  object with the keys "count" (number), "references" (array of reference
  objects) and "notifications".
 */
function getAllReferences(context) {
  const query = context.params.query;
  const res = context.res;

  if (query.order) {
    query.order = fixupOrderField(query.order);
  }
  if (query.where) {
    query.where = fixupWhereField(query.where, canBeNull);
  }

  return references
    .fetchAllReferencesCompleteWithCount(query)
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
  GET /references/{id}

  Fetch a single reference by ID. Return value is an object with keys
  "reference" (the reference object) and "notifications". The reference
  object will have RecordType, Magazine (when apropos) and Author information.
 */
function getReferenceById(context) {
  const id = context.params.path.id;
  const res = context.res;

  return references
    .fetchSingleReferenceComplete(id)
    .then((reference) => {
      if (reference) {
        res.status(200).pureJson({ reference });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No reference with this ID (${id}) found`,
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
  PUT /references/{id}

  Update the reference indicated by the ID, using the JSON content in the
  request body. Return value is an object with keys "reference" (the updated
  reference) and "notifications".
 */
function updateReferenceById(context) {
  const id = context.params.path.id;
  const { res, requestBody } = context;

  return references
    .updateReference(id, requestBody)
    .then((reference) => {
      if (reference) {
        res.status(200).pureJson({ reference });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No reference with this ID (${id}) found`,
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
  DELETE /references/{id}

  Delete the reference specified by the ID. Return value is an object with a
  single key, "notifications".
 */
function deleteReferenceById(context) {
  const id = context.params.path.id;
  const res = context.res;

  return references
    .deleteReferences(id)
    .then((number) => {
      if (number) {
        res.status(200).pureJson({});
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No reference with this ID (${id}) found`,
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
  createReference,
  getAllReferences,
  getReferenceById,
  updateReferenceById,
  deleteReferenceById,
};
