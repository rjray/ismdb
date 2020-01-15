/*
 * Functionality for /api/views/reference
 */

const express = require("express")

const {
  Reference,
  RecordType,
  MagazineIssue,
  Magazine,
} = require("../../../models")

let router = express.Router()

router.get("/:id", (req, res) => {
  let id = req.params.id
  let reference

  Reference.findByPk(id, { include: [RecordType, MagazineIssue] })
    .then(result => {
      reference = result

      let promises = [reference.getAuthors()]
      if (reference.MagazineIssue) {
        promises.push(
          Magazine.findByPk(reference.MagazineIssue.get("MagazineId")),
        )
      }

      return Promise.all(promises)
    })
    .then(([authors, magazine]) => {
      reference = reference.get()

      reference.Authors = authors
        .sort((a, b) => a.AuthorsReferences.order - b.AuthorsReferences.order)
        .map(attr => {
          attr = attr.get()
          delete attr.AuthorsReferences
          return attr
        })

      if (magazine) {
        reference.Magazine = magazine.get()
      }

      res.send({ status: "success", reference })
    })
    .catch(error => {
      error = {
        message: `No reference found for id ${id}`,
      }

      res.send({ status: "error", error })
    })
})

module.exports = router
