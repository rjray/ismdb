/*
  This is the exegesis controller module for all publisher operations (all API
  paths at/below "/publishers").
 */

const Publishers = require("../db/publishers");
const { fixupOrderField } = require("../lib/utils");

/*
  POST /publishers

  Create a new publisher record from the JSON content in the request body. The
  return value is an object with the key "publisher" (new publisher object).
 */
function createPublisher(context) {
  const { res, requestBody } = context;

  return Publishers.createPublisher(requestBody)
    .then((publisher) => {
      res.status(201).pureJson({ publisher });
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
  GET /publishers

  Return all publishers (with series information), possibly limited by params
  passed in. Also returns a count of all publishers that match the query, even
  if the query itself is governed by skip and/or limit. The returned object
  has keys "count" (integer) and "publishers" (list of publisher objects).
 */
function getAllPublishers(context) {
  const { query } = context.params;
  const { res } = context;

  if (query.order) {
    query.order = fixupOrderField(query.order);
  }

  return Publishers.fetchAllPublishersSimpleWithCount(query)
    .then((results) => {
      res.status(200).pureJson(results);
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
  GET /publishers/withReferences

  Return all publishers (with full information), possibly limited by params
  passed in. Also returns a count of all publishers that match the query, even
  if the query itself is governed by skip and/or limit. The returned object
  has keys "count" (integer) and "publishers" (list of publisher objects).
 */
function getAllPublishersWithReferences(context) {
  const { query } = context.params;
  const { res } = context;

  if (query.order) {
    query.order = fixupOrderField(query.order);
  }

  return Publishers.fetchAllPublishersCompleteWithCount(query)
    .then((results) => {
      res.status(200).pureJson(results);
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
  GET /publishers/{id}

  Get the specified publisher by the ID.
 */
function getPublisherById(context) {
  const { id } = context.params.path;
  const { res } = context;

  return Publishers.fetchSinglePublisherSimple(id)
    .then((publisher) => {
      if (publisher) {
        res.status(200).pureJson({ publisher });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No publisher with this ID (${id}) found`,
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
  PUT /publishers/{id}

  Update the publisher specified by the ID parameter, using the JSON content in
  the request body. The return value is an object with the key "publisher" (the
  updated publisher object).
 */
function updatePublisherById(context) {
  const { id } = context.params.path;
  const { res, requestBody } = context;

  return Publishers.updatePublisher(id, requestBody)
    .then((publisher) => {
      if (publisher) {
        res.status(200).pureJson({ publisher });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No publisher with this ID (${id}) found`,
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
  DELETE /publishers/{id}

  Delete the publisher specified by the ID parameter. No return value.
 */
function deletePublisherById(context) {
  const { id } = context.params.path;
  const { res } = context;

  return Publishers.deletePublisher(id)
    .then((number) => {
      if (number) {
        res.status(200).set("content-type", "text/plain");
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No publisher with this ID (${id}) found`,
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
  GET /publishers/{id}/withReferences

  Get the specified publisher by the ID with all references that are a part of
  that publisher.
 */
function getPublisherByIdWithReferences(context) {
  const { id } = context.params.path;
  const { res } = context;

  return Publishers.fetchSinglePublisherComplete(id)
    .then((publisher) => {
      if (publisher) {
        res.status(200).pureJson({ publisher });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No publisher with this ID (${id}) found`,
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
  createPublisher,
  updatePublisherById,
  deletePublisherById,
  getAllPublishers,
  getAllPublishersWithReferences,
  getPublisherById,
  getPublisherByIdWithReferences,
};
