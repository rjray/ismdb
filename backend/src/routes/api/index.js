/*
 * Root of the routing for /api
 */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const create = require("./create");
const retrieve = require("./retrieve");
const update = require("./update");
const del = require("./delete");
const misc = require("./misc");
const views = require("./views");

let router = express.Router();
router.use(cors());
router.use(bodyParser.json());

router.use("/create", create);
router.use("/retrieve", retrieve);
router.use("/update", update);
router.use("/delete", del);
router.use("/misc", misc);
router.use("/views", views);

module.exports = router;
