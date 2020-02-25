/*
 * /api/update/magazine
 */

const express = require("express")

const { updateMagazine } = require("../../../db/magazines")

const router = express.Router()

router.post("/", (req, res) => {
  const { id, ...body } = req.body

  updateMagazine(id, body)
    .then(magazine => {
      res.send({ status: "success", magazine })
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

module.exports = router
