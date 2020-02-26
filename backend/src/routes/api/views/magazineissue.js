/*
 * Functionality for /api/views/magazineissue
 */

const express = require("express")

const { fetchSingleMagazineIssueComplete } = require("../../../db/magazines")

let router = express.Router()

router.get("/:id", (req, res) => {
  let id = req.params.id

  fetchSingleMagazineIssueComplete(id)
    .then(magazineissue => {
      res.send({ status: "success", magazineissue })
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

module.exports = router
