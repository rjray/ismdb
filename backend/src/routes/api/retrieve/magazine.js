/*
 * Functionality for /api/magazine
 */

const express = require("express");

const { fetchSingleMagazineSimple } = require("../../../db/magazines");
const { objectifyError } = require("../../../lib/utils");

let router = express.Router();

router.get("/:id(\\d+)", (req, res) => {
  const id = req.params.id;

  fetchSingleMagazineSimple(id)
    .then((magazine) => {
      if (magazine) {
        res.send({ status: "success", magazine });
      } else {
        res.send({
          status: "error",
          error: new Error(`No magazine with id "${id}" found`),
        });
      }
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

module.exports = router;
