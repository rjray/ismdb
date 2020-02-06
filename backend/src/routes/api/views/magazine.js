/*
 * Functionality for /api/views/magazine
 */

const express = require("express")
const _ = require("lodash")

const {
  MagazineIssue,
  Magazine,
  Reference,
  sequelize,
} = require("../../../models")
const { compareVersion } = require("../../../lib/utils")

let router = express.Router()

router.get("/namesandissues", (req, res) => {
  Magazine.findAll({
    attributes: ["id", "name"],
    order: ["name"],
    include: [{ model: MagazineIssue, attributes: ["number"] }],
  })
    .then(magazines => {
      res.send({ status: "success", magazines })
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

router.get("/all", (req, res) => {
  const query = `
    SELECT m.*, COUNT(mi.id) AS issues
    FROM Magazines m LEFT JOIN MagazineIssues mi ON m.id = mi.magazineId
    GROUP BY m.id
  `
  const options = {
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
  const id = req.params.id

  Magazine.findByPk(id, {
    include: [{ model: MagazineIssue, include: [Reference] }],
  })
    .then(magazine => {
      magazine = magazine.get()

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
