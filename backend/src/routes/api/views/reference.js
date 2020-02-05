/*
 * Functionality for /api/views/reference
 */

const express = require("express")
const _ = require("lodash")

const {
  Reference,
  RecordType,
  MagazineIssue,
  Magazine,
  Author,
} = require("../../../models")

let router = express.Router()

router.get("/all", (req, res) => {
  Reference.findAll({
    include: [RecordType, { model: MagazineIssue, include: [Magazine] }],
  })
    .then(references => {
      references = references.map(item => {
        let reference = item.get()

        if (reference.MagazineIssue) {
          reference.Magazine = reference.MagazineIssue.Magazine.get()
          reference.MagazineIssue = reference.MagazineIssue.get()
          delete reference.MagazineIssue.Magazine
        }
        reference.RecordType = reference.RecordType.get()

        return reference
      })

      res.send({ status: "success", references })
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

router.get("/:id", (req, res) => {
  let id = req.params.id
  let reference

  Reference.findByPk(id, {
    include: [
      RecordType,
      {
        model: MagazineIssue,
        include: [Magazine],
      },
      {
        model: Author,
        as: "Authors",
      },
    ],
  })
    .then(result => {
      reference = result.get()

      reference.Authors = reference.Authors.sort(
        (a, b) => a.AuthorsReferences.order - b.AuthorsReferences.order
      ).map(author => {
        author = author.get()
        author.order = author.AuthorsReferences.order
        delete author.AuthorsReferences
        return author
      })

      if (reference.MagazineIssue) {
        reference.Magazine = reference.MagazineIssue.Magazine.get()
        reference.MagazineIssue = reference.MagazineIssue.get()
        delete reference.MagazineIssue.Magazine
      }

      res.send({ status: "success", reference })
    })
    .catch(error => {
      if (_.isEmpty(error)) {
        error = {
          message: `No reference found for id ${id}`,
        }
      }

      res.send({ status: "error", error })
    })
})

module.exports = router
