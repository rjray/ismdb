/*
 * Functionality for /api/views/author
 */

const express = require("express");

const {
  fetchAllAuthorsWithRefcount,
  fetchSingleAuthorComplex,
} = require("../../../db/authors");
const { objectifyError } = require("../../../lib/utils");

let router = express.Router();

router.get("/all", (req, res) => {
  fetchAllAuthorsWithRefcount()
    .then((authors) => {
      res.send({ status: "success", authors });
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  fetchSingleAuthorComplex(id)
    .then((author) => {
      if (author) {
        res.send({ status: "success", author });
      } else {
        res.send({
          status: "error",
          error: { message: `No author with id "${id}" found` },
        });
      }
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

module.exports = router;
