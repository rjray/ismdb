/*
  This is the exegesis controller module for all author operations (all API
  paths at/below "/author").
 */

const Authors = require("../db/authors");
const { fixupOrderField } = require("../lib/utils");

/*
  POST /authors

  Create a new author record from the JSON content in the request body. The
  return value is the new author object.
 */
function createAuthor(context) {
  const { res, requestBody } = context;

  return Authors.createAuthor(requestBody)
    .then((author) => {
      res.status(201).pureJson(author);
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
  GET /authors

  Return all authors (with alias information), possibly limited by params
  passed in. The returned value is the list of author objects.
 */
function getAllAuthors(context) {
  const { query } = context.params;
  const { res } = context;

  if (query.order) {
    query.order = fixupOrderField(query.order);
  }

  return Authors.fetchAllAuthorsWithAliases(query)
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
  GET /authors/withRefCount

  Return all authors (with alias information), with a "refcount" field added to
  each with the number of references they are credited on. Possibly limited by
  params passed in, as above. Return object's shape is identical to above (with
  the added field to each author object).
 */
function getAllAuthorsWithRefCount(context) {
  const { query } = context.params;
  const { res } = context;

  if (query.order) {
    query.order = fixupOrderField(query.order);
  }

  return Authors.fetchAllAuthorsWithRefCount(query)
    .then((authors) => {
      res.status(200).pureJson(authors);
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
  GET /authors/namesAndAliases

  Return a list of just author names and their IDs, with aliases also in the
  list (pointing to the name they alias). May be limited by the parameters
  passed in, as well. The returned value is an array of objects. Each object
  has "id" (integer) and "name" (string) fields, and may have an "aliasOf"
  (string) field. The list will be sorted on "name".
 */
function getAuthorNamesAndAliases(context) {
  const { query } = context.params;
  const { res } = context;

  if (query.order) {
    query.order = fixupOrderField(query.order);
  }

  return Authors.fetchAuthorsNamesAliasesList(query)
    .then((authors) => {
      res.status(200).pureJson(authors);
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
  GET /authors/{id}

  Fetch a single author by the ID. Returns the author object. Alias information
  is included.
 */
function getAuthorById(context) {
  const { id } = context.params.path;
  const { res } = context;

  return Authors.fetchSingleAuthorSimple(id)
    .then((author) => {
      if (author) {
        res.status(200).pureJson(author);
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No author with this ID (${id}) found`,
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
  PUT /authors/{id}

  Update the author specified by the ID parameter, using the JSON content in
  the request body. The return value is the updated author object.
 */
function updateAuthorById(context) {
  const { id } = context.params.path;
  const { res, requestBody } = context;

  return Authors.updateAuthor(id, requestBody)
    .then((author) => {
      if (author) {
        res.status(200).pureJson(author);
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No author with this ID (${id}) found`,
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
  DELETE /authors/{id}

  Delete the author specified by the ID parameter. No return value.
 */
function deleteAuthorById(context) {
  const { id } = context.params.path;
  const { res } = context;

  return Authors.deleteAuthor(id)
    .then((number) => {
      if (number) {
        res.status(200).set("content-type", "text/plain");
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No author with this ID (${id}) found`,
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
  GET /authors/{id}/withRefCount

  Fetch a single author by the ID. Returns the author object. Alias information
  is included. The author object has an additional field, "refcount" (integer),
  that has the number of references they are credited with.
 */
function getAuthorByIdWithRefCount(context) {
  const { id } = context.params.path;
  const { res } = context;

  return Authors.fetchSingleAuthorWithRefCount(id)
    .then((author) => {
      if (author) {
        res.status(200).pureJson(author);
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No author with this ID (${id}) found`,
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
  GET /authors/{id}/withRefsAndAliases

  Fetch a single author by the ID. The returned author record will have all
  alias information and a "references" key that has an array of Reference
  objects. The references list will be all references the author is credited
  on. The list is not ordered.
 */
function getAuthorByIdWithReferences(context) {
  const { id } = context.params.path;
  const { res } = context;

  return Authors.fetchSingleAuthorComplex(id)
    .then((author) => {
      if (author) {
        res.status(200).pureJson(author);
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No author with this ID (${id}) found`,
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
  createAuthor,
  getAllAuthors,
  getAllAuthorsWithRefCount,
  getAuthorNamesAndAliases,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
  getAuthorByIdWithRefCount,
  getAuthorByIdWithReferences,
};
