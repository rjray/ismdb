/*
 * Functionality for /api/misc/*
 */

const express = require("express")
const _ = require("lodash")

const { RecordType } = require("../../models")

let router = express.Router()

router.get("/recordtypes", (req, res) => {
  RecordType.findAll({ order: ["id"] })
    .then(recordtypes => {
      res.send({ status: "success", recordtypes })
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

module.exports = router
