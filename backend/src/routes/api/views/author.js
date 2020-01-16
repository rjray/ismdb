/*
 * Functionality for /api/views/author
 */

const express = require("express")
const _ = require("lodash")

const { Author } = require("../../../models")

let router = express.Router()

router.get("/:id", (req, res) => {
  let id = req.params.id
  let author

  Author.findByPk(id)
    .then(result => {
      author = result

      return author.getReferences()
    })
    .then(references => {
      author = author.get()

      author.References = references.map(item => {
        item = item.get()
        delete item.AuthorsReferences
        return item
      })

      res.send({ status: "success", author })
    })
    .catch(error => {
      if (_.isEmpty(error)) {
        error = {
          message: `No author found for id ${id}`,
        }
      }

      res.send({ status: "error", error })
    })
})

module.exports = router
