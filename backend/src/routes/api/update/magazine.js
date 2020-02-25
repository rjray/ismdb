/*
 * /api/update/magazine
 */

const express = require("express")

const { updateMagazine } = require("../../../db/magazines")

const router = express.Router()

router.post("/", (req, res) => {
  const { action, id, ...body } = req.body

  if (action !== "update") {
    res.send({
      status: "error",
      error: { message: "Invalid data packet for update" },
    })
  }

  updateMagazine(id, body)
    .then(magazine => {
      res.send({ status: "success", magazine })
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

module.exports = router
