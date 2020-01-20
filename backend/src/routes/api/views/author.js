/*
 * Functionality for /api/views/author
 */

const express = require("express")
const _ = require("lodash")

const { Author, Reference, sequelize } = require("../../../models")

let router = express.Router()

router.get("/all", (req, res) => {
  let query = `
    SELECT a.*, COUNT(ar.authorId) AS refcount
    FROM Authors a LEFT JOIN AuthorsReferences ar ON a.id = ar.authorId
    GROUP BY a.id
  `
  let options = {
    type: sequelize.QueryTypes.SELECT,
  }

  sequelize
    .query(query, options)
    .then(authors => {
      res.send({ status: "success", authors })
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

router.get("/:id", (req, res) => {
  let id = req.params.id
  let author

  Author.findByPk(id, { include: [{ model: Reference, as: "References" }] })
    .then(result => {
      author = result.get()
      author.References = author.References.map(item => {
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
