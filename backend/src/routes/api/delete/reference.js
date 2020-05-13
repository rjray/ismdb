/*
 * /api/delete/reference
 */

const express = require("express");

const { deleteReference } = require("../../../db/references");
const { objectifyError } = require("../../../lib/utils");

const router = express.Router();

router.post("/", (req, res) => {
  const id = req.body.id;

  deleteReference(id)
    .then(() => {
      res.send({ status: "success" });
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

module.exports = router;
