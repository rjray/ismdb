/*
 * Functionality for /api/magazine
 */

const express = require("express")

const { Magazine } = require("../../models")

let router = express.Router()

router.get("/:id(\\d+)", (req, res) => {
  let id = req.params.id

  Magazine.findByPk(id).then(magazine => {
    if (magazine) {
      magazine = magazine.get()
      res.send({ magazine })
    } else {
      let error = { message: `No magazine with id "${id}" found` }
      res.send({ error })
    }
  })
})

module.exports = router
