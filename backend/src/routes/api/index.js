/*
 * Root of the routing for /api
 */

const express = require("express")
const cors = require("cors")

const author = require("./author")
const magazine = require("./magazine")
const reference = require("./reference")
const views = require("./views")

let router = express.Router()
router.use(cors())

router.use("/author", author)
router.use("/magazine", magazine)
router.use("/reference", reference)
router.use("/views", views)

module.exports = router