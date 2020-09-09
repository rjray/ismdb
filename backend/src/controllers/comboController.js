"use strict";

/*
  This is the exegesis controller module for all combo operations (all API
  paths at/below "/combo").
 */

const { fetchAuthorsNamesAliasesList } = require("../db/authors");
const { fetchSingleReferenceComplete } = require("../db/references");
const {
  fetchSingleMagazineSimple,
  fetchAllMagazinesWithIssueNumbersAndCount,
} = require("../db/magazines");
const { fetchAllRecordTypes, fetchAllLanguages } = require("../db/misc");

/*
  GET /combo/magazineeditdata

  Get the bundle of data required for editing/creating magazine records. If the
  "id" parameter is given, this returns the list of languages and the full
  magazine record for the ID. If "id" is not given, returns just the languages.
  May also return notifications.
 */
function fetchCreateMagazineData(context, id) {
  const query = context.params.query;
  const res = context.res;

  const promises = [fetchAllLanguages(query)];
  if (id) {
    promises.push(fetchSingleMagazineSimple(id));
  }

  Promise.all(promises)
    .then((values) => {
      const languages = values[0];
      const magazine = id ? values[1] : null;

      if (id & !magazine) {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No magazine with this ID (${id}) found`,
          },
        });
      } else {
        const results = { languages };
        if (id) results.magazine = magazine;

        res.status(200).pureJson(results);
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
  GET /combo/magazineeditdata/{id}

  Front-end to the previous that extracts and passes the "id" parameter.
 */
function fetchEditMagazineData(context) {
  return fetchCreateMagazineData(context, context.params.path.id);
}

/*
  GET /combo/referenceeditdata

  Get the bundle of data required for editing/creating reference records. The
  return value is an object with keys "languages", "recordTypes", "authors",
  and "magazines". If the "id" parameter is given, the object will include a
  key "reference". May also return notifications.
 */
function fetchCreateReferenceData(context, id) {
  const query = context.params.query;
  const res = context.res;

  const promises = [
    fetchAllRecordTypes({ order: ["id"] }),
    fetchAllMagazinesWithIssueNumbersAndCount({ attributes: ["id", "name"] }),
    fetchAllLanguages(query),
    fetchAuthorsNamesAliasesList(),
  ];
  if (id) {
    promises.push(fetchSingleReferenceComplete(id));
  }

  Promise.all(promises)
    .then((values) => {
      const recordTypes = values[0];
      const magazines = values[1].magazines;
      const languages = values[2];
      const authors = values[3];
      const reference = id ? values[4] : null;

      if (id && !reference) {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No reference with this ID (${id}) found`,
          },
        });
      } else {
        const results = {
          recordTypes,
          magazines,
          authors,
          languages,
        };
        if (id) results.reference = reference;

        res.status(200).pureJson(results);
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
  GET /combo/referenceeditdata/{id}

  Front-end to the previous that extracts and passes the "id" parameter.
 */
function fetchEditReferenceData(context) {
  return fetchCreateReferenceData(context, context.params.path.id);
}

module.exports = {
  fetchCreateMagazineData,
  fetchEditMagazineData,
  fetchCreateReferenceData,
  fetchEditReferenceData,
};
