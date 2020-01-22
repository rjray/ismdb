/*
 * Functionality for /api/views/magazineissue
 */

const express = require("express")
const _ = require("lodash")

const {
  MagazineIssue,
  Magazine,
  Reference,
  RecordType,
  Author,
} = require("../../../models")

let router = express.Router()

router.get("/:id", (req, res) => {
  let id = req.params.id
  let magazineissue

  MagazineIssue.findByPk(id, {
    include: [
      Magazine,
      {
        model: Reference,
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
      },
    ],
  })
    .then(result => {
      magazineissue = result.get()

      magazineissue.Magazine = magazineissue.Magazine.get()
      magazineissue.References = magazineissue.References.map(reference => {
        reference = reference.get()

        if (reference.MagazineIssue) {
          reference.Magazine = reference.MagazineIssue.Magazine.get()
          reference.MagazineIssue = reference.MagazineIssue.get()
          delete reference.MagazineIssue.Magazine
        }
        reference.RecordType = reference.RecordType.get()

        return reference
      })

      res.send({ status: "success", magazineissue })
    })
    .catch(error => {
      if (_.isEmpty(error)) {
        error = {
          message: `No magazine issue found for id ${id}`,
        }
      }

      res.send({ status: "error", error })
    })
})

module.exports = router
