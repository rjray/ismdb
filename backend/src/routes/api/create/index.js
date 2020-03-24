/*
 * Root of the routing for /api/create
 */

const express = require("express")

//const author = require("./author")
const magazine = require("./magazine")
//const reference = require("./reference")

let router = express.Router()

//router.use("/author", author)
router.use("/magazine", magazine)
//router.use("/reference", reference)

module.exports = router
