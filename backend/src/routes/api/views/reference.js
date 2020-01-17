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
        (a, b) => a.AuthorsReferences.order - b.AuthorsReferences.order,
      ).map(attr => {
        attr = attr.get()
        delete attr.AuthorsReferences
        return attr
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
