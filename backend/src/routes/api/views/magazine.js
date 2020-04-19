/*
 * Functionality for /api/views/magazine
 */

const express = require("express");

const {
  fetchAllMagazinesWithIssueCount,
  fetchSingleMagazineComplete,
} = require("../../../db/magazines");
const { objectifyError } = require("../../../lib/utils");

let router = express.Router();

router.get("/all", (req, res) => {
  fetchAllMagazinesWithIssueCount()
    .then((magazines) => {
      res.send({ status: "success", magazines });
    })
    .catch((error) => {
      res.send({ status: "error", error: objectifyError(error) });
    });
});

router.get("/:id(\\d+)", (req, res) => {
  const id = req.params.id;

  fetchSingleMagazineComplete(id)
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
