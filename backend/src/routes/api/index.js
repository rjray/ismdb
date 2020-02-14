/*
 * Root of the routing for /api
 */

const express = require("express")
const cors = require("cors")

const retrieve = require("./retrieve")
const misc = require("./misc")
const views = require("./views")

let router = express.Router()
router.use(cors())

router.use("/retrieve", retrieve)
router.use("/misc", misc)
router.use("/views", views)

module.exports = router
