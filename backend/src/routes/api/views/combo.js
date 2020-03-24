/*
 * Functionality for /api/views/combo
 */

const express = require("express")

const { fetchLanguages } = require("../../../db/raw-sql")
const {
  fetchSingleMagazineSimple,
  fetchAllMagazinesWithIssueNumbers,
} = require("../../../db/magazines")
const { fetchSingleReferenceComplete } = require("../../../db/references")
const { fetchAllRecordTypes } = require("../../../db/misc")
const { objectifyError } = require("../../../lib/utils")

let router = express.Router()

router.get("/editreference/:id(\\d+)?", (req, res) => {
  let id = req.params.id

  let promises = [
    fetchAllRecordTypes({ order: ["id"] }),
    fetchAllMagazinesWithIssueNumbers({ attributes: ["id", "name"] }),
    fetchLanguages(),
  ]
  if (id) {
    promises.push(fetchSingleReferenceComplete(id))
  }

  Promise.all(promises)
    .then(values => {
      let recordtypes = values[0]
      let magazines = values[1]
      let languages = values[2]
      let reference = id ? values[3] : {}

      res.send({
        status: "success",
        recordtypes,
        magazines,
        languages,
        reference,
      })
    })
    .catch(error => {
      res.send({ status: "error", error: objectifyError(error) })
    })
})

router.get("/editmagazine/:id(\\d+)?", (req, res) => {
  let id = req.params.id

  let promises = [fetchLanguages()]
  if (id) {
    promises.push(fetchSingleMagazineSimple(id))
  }

  Promise.all(promises)
    .then(values => {
      let languages = values[0]
      let magazine = id ? values[1] : {}

      res.send({
        status: "success",
        languages,
        magazine,
      })
    })
    .catch(error => {
      res.send({ status: "error", error: objectifyError(error) })
    })
})

module.exports = router
