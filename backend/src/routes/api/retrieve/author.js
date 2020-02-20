/*
 * Functionality for /api/author
 */

const express = require("express")

const { fetchSingleAuthorSimple } = require("../../../db/authors")

let router = express.Router()

router.get("/:id(\\d+)", (req, res) => {
  const id = req.params.id

  fetchSingleAuthorSimple(id)
    .then(author => {
      if (author) {
        res.send({ status: "success", author })
      } else {
        res.send({ status: "error", error: `No author with id "${id}" found` })
      }
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

module.exports = router
