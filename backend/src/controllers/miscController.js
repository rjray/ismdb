"use strict";

/*
  This is the exegesis controller module for all miscellaneous operations (all
  API paths at/below "/misc").
 */

const { fetchAllRecordTypes, fetchAllLanguages } = require("../db/misc");

/*
  GET /misc/recordtypes

  Get all RecordType entities, sorted by ID. The return value is an object with
  one key, "recordTypes", that is an array of the types. Each array entry is an
  object with "id", "name", "description" and "notes" keys.
 */
function getAllRecordTypes(context) {
  const res = context.res;

  return fetchAllRecordTypes({ order: ["id"] })
    .then((recordTypes) => {
      recordTypes = recordTypes.map((item) => item.get());
      res.status(200).pureJson({ recordTypes });
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
  const query = context.params.query;
  const res = context.res;

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

module.exports = {
  getAllRecordTypes,
  getAllLanguages,
};
