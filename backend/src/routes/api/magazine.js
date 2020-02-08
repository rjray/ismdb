/*
 * Functionality for /api/magazine
 */

const express = require("express")
const _ = require("lodash")

const { Magazine } = require("../../models")

let router = express.Router()

router.get("/:id(\\d+)", (req, res) => {
  let id = req.params.id

  Magazine.findByPk(id)
    .then(magazine => {
      if (magazine) {
        magazine = magazine.get()
        res.send({ status: "success", magazine })
      } else {
        let error = { message: `No magazine with id "${id}" found` }
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
