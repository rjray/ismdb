"use strict";

/*
  This is the exegesis controller module for all combo operations (all API
  paths at/below "/combo").
 */

const { fetchAuthorsNamesAliasesList } = require("../db/authors");
const { fetchSingleReferenceComplete } = require("../db/references");
const {
  fetchAllMagazinesWithIssueNumbersAndCount,
} = require("../db/magazines");
const { fetchAllRecordTypes, fetchAllLanguages } = require("../db/misc");

/*
  GET /combo/referencecombo
  GET /combo/referencecombo/{id}

  Get the bundle of data required for editing/creating reference records. The
  return value is an object with keys "languages", "recordTypes", "authors",
  and "magazines". If the "id" parameter is given, the object will include a
  key "reference". May also return notifications.
 */
function fetchReferenceCombo(context) {
  const id = context.params.path.id || null;
  const query = context.params.query;
  const res = context.res;

  const promises = [
    fetchAllRecordTypes({ order: ["id"] }),
    fetchAllMagazinesWithIssueNumbersAndCount(),
    fetchAllLanguages(query),
    fetchAuthorsNamesAliasesList(),
  ];
  if (id) {
    promises.push(fetchSingleReferenceComplete(id));
  }

  return Promise.all(promises)
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

module.exports = {
  fetchReferenceCombo,
};
