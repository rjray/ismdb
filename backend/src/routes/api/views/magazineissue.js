/*
 * Functionality for /api/views/magazineissue
 */

const express = require("express")

const { MagazineIssue, Magazine, Reference } = require("../../../models")

let router = express.Router()

router.get("/:id", (req, res) => {
  let id = req.params.id
  let magazineissue

  MagazineIssue.findByPk(id, { include: [Magazine, Reference] })
    .then(result => {
      magazineissue = result
      magazineissue = magazineissue.get()

      res.send({ status: "success", magazineissue })
    })
    .catch(error => {
      error = {
        message: `No magazine issue found for id ${id}`,
      }

      res.send({ status: "error", error })
    })
})

module.exports = router
