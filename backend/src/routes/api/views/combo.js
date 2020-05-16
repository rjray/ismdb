/*
 * Functionality for /api/views/combo
 */

const express = require("express");

const { fetchLanguages } = require("../../../db/raw-sql");
const { fetchAllAuthorsWithAliases } = require("../../../db/authors");
const {
  fetchSingleMagazineSimple,
  fetchAllMagazinesWithIssueNumbers,
} = require("../../../db/magazines");
const { fetchSingleReferenceComplete } = require("../../../db/references");
const { fetchAllRecordTypes } = require("../../../db/misc");
const { sortBy, objectifyError } = require("../../../lib/utils");

const router = express.Router();

router.get("/editreference/:id(\\d+)?", (req, res) => {
  const id = req.params.id;

  const promises = [
    fetchAllRecordTypes({ order: ["id"] }),
    fetchAllMagazinesWithIssueNumbers({ attributes: ["id", "name"] }),
    fetchLanguages(),
    fetchAllAuthorsWithAliases(),
  ];
  if (id) {
    promises.push(fetchSingleReferenceComplete(id));
  }

  Promise.all(promises)
    .then((values) => {
      const recordtypes = values[0];
      const magazines = values[1];
      const languages = values[2];
      const allAuthors = values[3];
      const reference = id ? values[4] : {};

      const authorlist = [];
      for (const author of allAuthors) {
        const { id, name, aliases } = author;

        // Start with the author themselves:
        authorlist.push({ id, name });
        // Add any aliases for this author:
        for (const alias of aliases) {
          authorlist.push({ id, name: alias.name, aliasOf: name });
        }
      }
      authorlist.sort(sortBy("name"));

      res.send({
        status: "success",
        recordtypes,
        magazines,
        languages,
        authorlist,
        reference,
      });
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

router.get("/editmagazine/:id(\\d+)?", (req, res) => {
  const id = req.params.id;

  const promises = [fetchLanguages()];
  if (id) {
    promises.push(fetchSingleMagazineSimple(id));
  }

  Promise.all(promises)
    .then((values) => {
      const languages = values[0];
      const magazine = id ? values[1] : {};

      res.send({
        status: "success",
        languages,
        magazine,
      });
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

module.exports = router;
