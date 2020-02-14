/*
 * Root of the routing for /api
 */

const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const retrieve = require("./retrieve")
const update = require("./update")
const misc = require("./misc")
const views = require("./views")

let router = express.Router()
router.use(cors())
router.use(bodyParser.json())

router.use("/retrieve", retrieve)
router.use("/update", update)
router.use("/misc", misc)
router.use("/views", views)

module.exports = router
