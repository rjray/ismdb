/*
 * Functionality for /api/reference
 */

const express = require("express")

const { Reference, RecordType, MagazineIssue } = require("../../models")

let router = express.Router()

router.get("/:id(\\d+)", (req, res) => {
  let id = req.params.id

  Reference.findByPk(id, { include: [RecordType, MagazineIssue] }).then(
    reference => {
      if (reference) {
        reference = reference.get()
        res.send({ reference })
      } else {
        let error = { message: `No reference with id "${id}" found` }
        res.send({ status: "error", error })
      }
    },
  )
})

module.exports = router
