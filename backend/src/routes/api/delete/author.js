/*
 * /api/delete/author
 */

const express = require("express");

const { deleteAuthor } = require("../../../db/authors");
const { objectifyError } = require("../../../lib/utils");

const router = express.Router();

router.post("/", (req, res) => {
  const id = req.body.id;

  deleteAuthor(id)
    .then(() => {
      res.send({ status: "success" });
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

module.exports = router;
