/*
 * /api/create/reference
 */

const express = require("express");

const { createReference } = require("../../../db/references");
const { objectifyError } = require("../../../lib/utils");

const router = express.Router();

router.post("/", (req, res) => {
  const body = req.body;

  createReference(body)
    .then((data) => {
      res.send({ status: "success", ...data });
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

module.exports = router;
