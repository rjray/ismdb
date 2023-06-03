/*
  This is the exegesis controller module for all magazine issue operations (all
  API paths at/below "/issue").
 */

const Magazines = require("../db/magazines");

/*
  POST /issues

  Create a new magazine issue record from the content in the request body. The
  return value is the new magazine issue.
 */
function createMagazineIssue(context) {
  const { res, requestBody } = context;

  return Magazines.createMagazineIssue(requestBody)
    .then((magazineissue) => {
      res.status(201).pureJson(magazineissue);
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        },
      });
    });
}

/*
  GET /issues/{id}

  Retrieve a single magazine issue record by ID from the database, with all the
  associated references. Returns the magazine issue data with an extra field
  ("references") containing an array of reference objects.
 */
function getMagazineIssueById(context) {
  const { id } = context.params.path;
  const { res } = context;

  return Magazines.fetchSingleMagazineIssueComplete(id)
    .then((issue) => {
      if (issue) {
        res.status(200).pureJson(issue);
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No issue with this ID (${id}) found`,
          },
        });
      }
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        },
      });
    });
}

/*
  PUT /issues/{id}

  Update the magazine issue record indicated by the ID parameter, using the
  content of the request body. Return value is the updated issue record.
 */
function updateMagazineIssueById(context) {
  const { id } = context.params.path;
  const { res, requestBody } = context;

  return Magazines.updateMagazineIssue(id, requestBody)
    .then((issue) => {
      if (issue) {
        res.status(200).pureJson(issue);
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No issue with this ID (${id}) found`,
          },
        });
      }
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        },
      });
    });
}

/*
  DELETE /issues/{id}

  Delete the magazine issue record indicated by the ID parameter. No return
  value.
 */
function deleteMagazineIssueById(context) {
  const { id } = context.params.path;
  const { res } = context;

  return Magazines.deleteMagazineIssue(id)
    .then((number) => {
      if (number) {
        res.status(200).set("content-type", "text/plain");
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No issue with this ID (${id}) found`,
          },
        });
      }
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        },
      });
    });
}

module.exports = {
  createMagazineIssue,
  getMagazineIssueById,
  updateMagazineIssueById,
  deleteMagazineIssueById,
};
