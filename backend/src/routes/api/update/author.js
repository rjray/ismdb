/*
 * /api/update/author
 */

const express = require("express")

const { updateAuthor } = require("../../../db/authors")

const router = express.Router()

router.post("/", (req, res) => {
  const { action, id, ...body } = req.body

  if (action !== "update") {
    res.send({
      status: "error",
      error: new Error("Invalid data packet for update"),
    })
  }

  updateAuthor(id, body)
    .then(author => {
      res.send({ status: "success", author })
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

module.exports = router
