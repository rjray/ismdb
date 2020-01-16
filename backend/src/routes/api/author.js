/*
 * Functionality for /api/author
 */

const express = require("express")
const _ = require("lodash")

const { Author } = require("../../models")

let router = express.Router()

router.get("/:id(\\d+)", (req, res) => {
  let id = req.params.id

  Author.findByPk(id)
    .then(author => {
      if (author) {
        author = author.get()
        res.send({ author })
      } else {
        let error = { message: `No author with id "${id}" found` }
        res.send({ status: "error", error })
      }
    })
    .catch(error => {
      if (_.isEmpty(error)) {
        error = {
          message: "Empty exception thrown!",
        }
      }

      res.send({ status: "error", error })
    })
})

module.exports = router
