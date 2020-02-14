/*
 * /api/update/magazine
 */

const express = require("express")

const { Magazine } = require("../../../models")

const router = express.Router()

router.post("/", (req, res) => {
  const { action, id, ...body } = req.body

  if (action !== "update") {
    res.send({
      status: "error",
      error: { message: "Invalid data packet for update" },
    })
  }

  body.createdAt = new Date(body.createdAt)
  // Since we're updating...
  body.updatedAt = new Date()

  Magazine.findByPk(id)
    .then(record => {
      return record.update(body)
    })
    .then(record => {
      let magazine = record.get()
      res.send({ status: "success", magazine })
    })
    .catch(error => {
      error = error.errors[0]
      res.send({ status: "error", error })
    })
})

module.exports = router
