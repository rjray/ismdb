/*
 * Functionality for /api/views/magazine
 */

const express = require("express")

const {
  fetchAllMagazinesWithIssueCount,
  fetchSingleMagazineComplete,
} = require("../../../db/magazines")

let router = express.Router()

router.get("/all", (req, res) => {
  fetchAllMagazinesWithIssueCount()
    .then(magazines => {
      res.send({ status: "success", magazines })
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

router.get("/:id(\\d+)", (req, res) => {
  const id = req.params.id

  fetchSingleMagazineComplete(id)
    .then(magazine => {
      console.log(JSON.stringify(magazine, null, 2))
      if (magazine) {
        res.send({ status: "success", magazine })
      } else {
        res.send({
          status: "error",
          error: new Error(`No magazine with id "${id}" found`),
        })
      }
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

module.exports = router
