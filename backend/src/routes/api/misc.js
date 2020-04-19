/*
 * Functionality for /api/misc/*
 */

const express = require("express");

const { fetchAllRecordTypes } = require("../../db/misc");
const { objectifyError } = require("../../lib/utils");

let router = express.Router();

router.get("/recordtypes", (req, res) => {
  fetchAllRecordTypes({ order: ["id"] })
    .then((recordtypes) => {
      res.send({ status: "success", recordtypes });
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

module.exports = router;
