/*
 * /api/delete/magazine
 */

const express = require("express");

const { deleteMagazine } = require("../../../db/magazines");
const { objectifyError } = require("../../../lib/utils");

const router = express.Router();

router.post("/", (req, res) => {
  const id = req.body.id;

  deleteMagazine(id)
    .then(() => {
      res.send({ status: "success" });
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

module.exports = router;
