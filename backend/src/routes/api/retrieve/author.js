/*
 * Functionality for /api/author
 */

const express = require("express")

const { fetchSingleAuthorSimple } = require("../../../db/authors")
const { objectifyError } = require("../../../lib/utils")

let router = express.Router()

router.get("/:id(\\d+)", (req, res) => {
  const id = req.params.id

  fetchSingleAuthorSimple(id)
    .then(author => {
      if (author) {
        res.send({ status: "success", author })
      } else {
        res.send({
          status: "error",
          error: new Error(`No author with id "${id}" found`),
        })
      }
    })
    .catch(error => {
      res.send({ status: "error", error: objectifyError(error) })
    })
})

module.exports = router
