/*
 * /api/create/author
 */

const express = require("express");

const { createAuthor } = require("../../../db/authors");
const { objectifyError } = require("../../../lib/utils");

const router = express.Router();

router.post("/", (req, res) => {
  const body = req.body;

  createAuthor(body)
    .then((author) => {
      res.send({ status: "success", author });
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

module.exports = router;
