/*
 * Functionality for /api/reference
 */

const express = require("express")
const _ = require("lodash")

const { Reference, RecordType, MagazineIssue } = require("../../models")

let router = express.Router()

router.get("/:id(\\d+)", (req, res) => {
  let id = req.params.id

  Reference.findByPk(id, { include: [RecordType, MagazineIssue] })
    .then(reference => {
      if (reference) {
        reference = reference.get()
        res.send({ status: "success", reference })
      } else {
        let error = { message: `No reference with id "${id}" found` }
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
