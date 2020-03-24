/*
 * /api/create/magazine
 */

const express = require("express")

const { createMagazine } = require("../../../db/magazines")

const router = express.Router()

router.post("/", (req, res) => {
  const body = req.body

  createMagazine(body)
    .then(magazine => {
      res.send({ status: "success", magazine })
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

module.exports = router
