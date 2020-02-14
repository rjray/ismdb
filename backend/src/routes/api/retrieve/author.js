/*
 * Functionality for /api/author
 */

const express = require("express")
const _ = require("lodash")

const { Author, AuthorAlias } = require("../../../models")

let router = express.Router()

router.get("/:id(\\d+)", (req, res) => {
  const id = req.params.id

  Author.findByPk(id, { include: [AuthorAlias] })
    .then(author => {
      if (author) {
        author = author.get()
        author.AuthorAliases = author.AuthorAliases.map(item => {
          item = item.get()
          delete item.AuthorId
          return item
        })
        res.send({ status: "success", author })
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
