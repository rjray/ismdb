/*
 * Root of the routing for /api/delete
 */

const express = require("express");

const author = require("./author");
const magazine = require("./magazine");
const magazineissue = require("./magazineissue");
const reference = require("./reference");

let router = express.Router();

router.use("/author", author);
router.use("/magazine", magazine);
router.use("/magazineissue", magazineissue);
router.use("/reference", reference);

module.exports = router;