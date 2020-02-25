/*
 * /api/update/author
 */

const express = require("express")

const { updateAuthor } = require("../../../db/authors")

const router = express.Router()

router.post("/", (req, res) => {
  const { id, ...body } = req.body

  updateAuthor(id, body)
    .then(author => {
      res.send({ status: "success", author })
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

module.exports = router
