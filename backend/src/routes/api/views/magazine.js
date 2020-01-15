/*
 * Functionality for /api/views/magazine
 */

const express = require("express")

const { MagazineIssue, Magazine } = require("../../../models")
const { compareVersion } = require("../../../lib/utils")

let router = express.Router()

router.get("/:id", (req, res) => {
  let id = req.params.id
  let magazine

  Magazine.findByPk(id, { include: [MagazineIssue] }).then(result => {
    magazine = result.get()

    magazine.MagazineIssues = magazine.MagazineIssues.map(item => {
      item = item.get()
      delete item.MagazineId
      return item
    }).sort((a, b) => compareVersion(a.number, b.number))

    res.send({ magazine })
  })
})

module.exports = router
