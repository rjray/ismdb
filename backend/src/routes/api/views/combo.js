/*
 * Functionality for /api/views/combo
 */

const express = require("express")
const _ = require("lodash")

const {
  Reference,
  RecordType,
  MagazineIssue,
  Magazine,
  Author,
  sequelize,
} = require("../../../models")

let router = express.Router()

router.get("/editreference/:id(\\d+)?", (req, res) => {
  let id = req.params.id

  const langQuery = `
    SELECT DISTINCT(language) FROM \`References\` WHERE
    language IS NOT NULL AND language != "" ORDER BY language
  `
  const queryOptions = {
    type: sequelize.QueryTypes.SELECT,
  }

  let promises = [
    RecordType.findAll({ order: ["id"] }),
    Magazine.findAll({
      attributes: ["id", "name"],
      order: ["name"],
      include: [{ model: MagazineIssue, attributes: ["number"] }],
    }),
    sequelize.query(langQuery, queryOptions),
  ]
  if (id) {
    promises.push(
      Reference.findByPk(id, {
        include: [
          RecordType,
          {
            model: MagazineIssue,
            include: [Magazine],
          },
          {
            model: Author,
            as: "Authors",
          },
        ],
      })
    )
  }

  Promise.all(promises)
    .then(values => {
      let recordtypes = values[0]
      let magazines = values[1]
      let languages = values[2]
      let reference = id ? values[3] : {}

      languages = languages.map(l => l.language)

      if (!_.isEmpty(reference)) {
        reference = reference.get()

        reference.Authors = reference.Authors.sort(
          (a, b) => a.AuthorsReferences.order - b.AuthorsReferences.order
        ).map(author => {
          author = author.get()
          author.order = author.AuthorsReferences.order
          delete author.AuthorsReferences
          return author
        })

        if (reference.MagazineIssue) {
          reference.Magazine = reference.MagazineIssue.Magazine.get()
          reference.MagazineIssue = reference.MagazineIssue.get()
          delete reference.MagazineIssue.Magazine
        }
      }

      res.send({
        status: "success",
        recordtypes,
        magazines,
        languages,
        reference,
      })
    })
    .catch(error => {
      if (_.isEmpty(error)) {
        error = {
          message: `No reference found for id ${id}`,
        }
      }

      res.send({ status: "error", error })
    })
})

module.exports = router
