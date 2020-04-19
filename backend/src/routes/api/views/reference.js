/*
 * Functionality for /api/views/reference
 */

const express = require("express");
const _ = require("lodash");

const {
  fetchSingleReferenceComplete,
  fetchAllReferencesSimple,
} = require("../../../db/references");
const { objectifyError } = require("../../../lib/utils");

let router = express.Router();

router.get("/all", (req, res) => {
  fetchAllReferencesSimple()
    .then((references) => {
      res.send({ status: "success", references });
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  fetchSingleReferenceComplete(id)
    .then((reference) => {
      res.send({ status: "success", reference });
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

module.exports = router;
