/*
 * Functionality for /api/reference
 */

const express = require("express")

const { Reference, RecordType, MagazineIssue } = require("../../../models")

let router = express.Router()

router.get("/:id(\\d+)", (req, res) => {
  const id = req.params.id

  Reference.findByPk(id, { include: [RecordType, MagazineIssue] })
    .then(reference => {
      if (reference) {
        reference = reference.get()
        res.send({ status: "success", reference })
      } else {
        res.send({
          status: "error",
          error: new Error(`No reference with id "${id}" found`),
        })
      }
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

module.exports = router
