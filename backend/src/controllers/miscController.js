/*
  This is the exegesis controller module for all miscellaneous operations (all
  API paths at/below "/misc").
 */

const {
  fetchAllReferenceTypes,
  fetchAllLanguages,
  fetchAllTagTypes,
} = require("../db/misc");
const { quickSearchByName } = require("../db/raw-sql");

/*
  GET /misc/referencetypes

  Get all ReferenceType entities, sorted by ID. The return value is an object
  with one key, "referenceTypes", that is an array of the types. Each array
  entry is an object with "id", "name", "description" and "notes" keys.
 */
function getAllReferenceTypes(context) {
  const { res } = context;

  return fetchAllReferenceTypes({ order: ["id"] })
    .then((referenceTypes) => {
      res.status(200).pureJson({ referenceTypes });
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
  GET /misc/languages

  Get all distinct language strings from the References table. The return value
  is an object with one key, "languages", that is an array of the languages in
  alphabetic order. One query parameter is recognized, "preferred", which
  defaults to "English". The preferred language is moved to the head of the
  list (added if it isn't already there).
 */
function getAllLanguages(context) {
  const { query } = context.params;
  const { res } = context;

  return fetchAllLanguages(query)
    .then((languages) => {
      res.status(200).pureJson({ languages });
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
  GET /misc/tagtypes

  Get all distinct "type" values from the tags table. The return value is an
  object with one key, "types", that is an array of the types in alphabetic
  order.
 */
function getAllTagTypes(context) {
  const { res } = context;

  return fetchAllTagTypes()
    .then((types) => {
      res.status(200).pureJson({ types });
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
  GET /misc/quicksearch

  Get the records that match the "query" parameter in a substring context on
  their "name" fields. The return value is an object with one key, "matches",
  that is an array of match objects. Each match object consists of the fields
  "id", "name", "type" and "length". The "id" is the record's ID in its own
  table, "name" is the record's name, "length" is the length of "name", and
  "type" is one of (tags, references, magazines, authors).
 */
function quickSearchName(context) {
  const { query, count } = context.params.query;
  const { res } = context;

  return quickSearchByName(query, count)
    .then((matches) => {
      res.status(200).pureJson({ matches });
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
  getAllReferenceTypes,
  getAllLanguages,
  getAllTagTypes,
  quickSearchName,
};
