/*
 * Functionality for /api/views/magazine
 */

const express = require("express")
const _ = require("lodash")

const { MagazineIssue, Magazine, sequelize } = require("../../../models")
const { compareVersion } = require("../../../lib/utils")

let router = express.Router()

router.get("/all", (req, res) => {
  let query = `
    SELECT m.id, m.name, m.createdAt, COUNT(mi.id) AS issues
    FROM Magazines m LEFT JOIN MagazineIssues mi ON m.id = mi.magazineId
    GROUP BY m.id
  `
  let options = {
    type: sequelize.QueryTypes.SELECT,
  }

  sequelize
    .query(query, options)
    .then(magazines => {
      res.send({ status: "success", magazines })
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

router.get("/:id(\\d+)", (req, res) => {
  let id = req.params.id
  let magazine

  Magazine.findByPk(id, { include: [MagazineIssue] })
    .then(result => {
      magazine = result.get()

      magazine.MagazineIssues = magazine.MagazineIssues.map(item => {
        item = item.get()
        delete item.MagazineId
        return item
      }).sort((a, b) => compareVersion(a.number, b.number))

      res.send({ status: "success", magazine })
    })
    .catch(error => {
      if (_.isEmpty(error)) {
        error = {
          message: `No magazine found for id ${id}`,
        }
      }

      res.send({ status: "error", error })
    })
})

module.exports = router
