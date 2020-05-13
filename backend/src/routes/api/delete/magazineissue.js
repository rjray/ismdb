/*
 * /api/delete/magazineissue
 */

const express = require("express");

const { deleteMagazineIssue } = require("../../../db/magazines");
const { objectifyError } = require("../../../lib/utils");

const router = express.Router();

router.post("/", (req, res) => {
  const id = req.body.id;

  deleteMagazineIssue(id)
    .then(() => {
      res.send({ status: "success" });
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

module.exports = router;
