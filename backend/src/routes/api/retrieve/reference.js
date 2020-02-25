/*
 * Functionality for /api/reference
 */

const express = require("express")

const { fetchSingleReferenceSimple } = require("../../../db/references")

let router = express.Router()

router.get("/:id(\\d+)", (req, res) => {
  const id = req.params.id

  fetchSingleReferenceSimple(id)
    .then(reference => {
      if (reference) {
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
