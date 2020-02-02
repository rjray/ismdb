/*
 * Functionality for /api/views/author
 */

const express = require("express")
const _ = require("lodash")

const {
  Author,
  AuthorAlias,
  Reference,
  RecordType,
  Magazine,
  MagazineIssue,
} = require("../../../models")

let router = express.Router()

router.get("/all", (req, res) => {
  Author.findAll({
    include: [AuthorAlias, { model: Reference, as: "References" }],
  })
    .then(authors => {
      authors = authors.map(author => {
        author = author.get()
        author.AuthorAliases = author.AuthorAliases.map(alias => {
          alias = alias.get()
          delete alias.AuthorId
          return alias
        })
        author.refcount = author.References.length
        delete author.References

        return author
      })

      res.send({ status: "success", authors })
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

router.get("/:id", (req, res) => {
  const id = req.params.id

  Author.findByPk(id, {
    include: [
      AuthorAlias,
      {
        model: Reference,
        as: "References",
        include: [RecordType, { model: MagazineIssue, include: [Magazine] }],
      },
    ],
  })
    .then(author => {
      author = author.get()
      author.AuthorAliases = author.AuthorAliases.map(item => {
        item = item.get()
        delete item.AuthorId
        return item
      })
      author.References = author.References.map(item => {
        item = item.get()
        delete item.AuthorsReferences
        if (item.MagazineIssue) {
          item.Magazine = item.MagazineIssue.Magazine.get()
          item.MagazineIssue = item.MagazineIssue.get()
          delete item.MagazineIssue.Magazine
        }
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
