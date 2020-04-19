/*
 * Root of the routing for /api/views
 */

const express = require("express");

const author = require("./author");
const magazine = require("./magazine");
const magazineissue = require("./magazineissue");
const reference = require("./reference");
const combo = require("./combo");

let router = express.Router();

router.use("/author", author);
router.use("/magazine", magazine);
router.use("/magazineissue", magazineissue);
router.use("/reference", reference);
router.use("/combo", combo);

module.exports = router;
