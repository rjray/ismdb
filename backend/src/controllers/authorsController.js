"use strict";

/*
  This is the exegesis controller module for all author operations (all API
  paths at/below "/author").
 */

const authors = require("../db/authors");
const { sortBy } = require("../lib/utils");

/*
  POST /author

  Create a new author record from the JSON content in the request body. The
  return value is an object with the keys "author" (new author object) and
  "notifications" (an array of notification objects, usually just one element
  in this case).
 */
function createAuthor(context) {
  const { res, requestBody } = context;

  return authors.createAuthor(requestBody)
    .then((author) => {
      res.status(200).pureJson({ author });
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        }
      });
    });
}

/*
  GET /author

  Return all authors (with alias information), possibly limited by params
  passed in. Also returns a count of all authors that match the query, even
  if the query itself is governed by skip and/or limit. The returned object
  has keys "count" (integer) and "authors" (list of author objects).
 */
function getAllAuthors(context) {
  const query = context.params.query;
  const res = context.res;

  return authors.fetchAllAuthorsWithAliasesAndCount()
    .then((results) => {
      res.status(200).pureJson(results);
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        }
      });
    });
}

/*
  GET /author/withRefCount

  Return all authors (with alias information), with a "refcount" field added to
  each with the number of references they are credited on. Possibly limited by
  params passed in, as above. Return object's shape is identical to above (with
  the added field to each author object).
 */
function getAllAuthorsWithRefCount(context) {
  const query = context.params.query;
  const res = context.res;

  return authors.fetchAllAuthorsWithRefcountAndCount()
    .then((results) => {
      res.status(200).pureJson(results);
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        }
      });
    });
}

/*
  Return a list of just author names and their IDs, with aliases also in the
  list (pointing to the name they alias). May be limited by the parameters
  passed in, as well. The returned object has a single key, "authors", that is
  an array of objects. Each object has "id" (integer) and "name" (string)
  fields, and may have an "aliasOf" (string) field. The list will be sorted on
  "name".
 */
function getAuthorNamesAndAliases(context) {
  const query = context.params.query;
  const res = context.res;

  return authors.fetchAllAuthorsWithAliases()
    .then((authorlist) => {
      const authors = [];
      for (const author of authorlist) {
        const { id, name, aliases } = author;

        // Start with the author themselves:
        authors.push({ id, name });
        // Add any aliases for this author:
        for (const alias of aliases) {
          authors.push({ id, name: alias.name, aliasOf: name });
        }
      }
      authors.sort(sortBy("name"));

      res.status(200).pureJson({ authors });
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        }
      });
    });
}

/*
  GET /author/{id}

  Fetch a single author by the ID. Returns an object with a single field,
  "author", whose value is the author object. Alias information is included.
 */
function getAuthorById(context) {
  const id = context.params.path.id;
  const res = context.res;

  return authors.fetchSingleAuthorSimple(id)
    .then((author) => {
      if (author) {
        res.status(200).pureJson({ author });
      } else {
        res.status(404)
          .pureJson({
            error: {
              summary: "Not found",
              description: `No author with this ID (${id}) found`,
            }
          });
      }
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        }
      });
    });
}

/*
  PUT /author/{id}

  Update the author specified by the ID parameter, using the JSON content in
  the request body. The return value is an object with the keys "author" (the
  updated author object) and "notifications" (an array of notification objects,
  usually just one element in this case).
 */
function updateAuthorById(context) {
  const id = context.params.path.id;
  const { res, requestBody } = context;

  return authors.updateAuthor(id, requestBody)
    .then((author) => {
      if (author) {
        res.status(200).pureJson({ author });
      } else {
        res.status(404)
          .pureJson({
            error: {
              summary: "Not found",
              description: `No author with this ID (${id}) found`,
            }
          });
      }
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        }
      });
    });
}

/*
  DELETE /author/{id}

  Delete the author specified by the ID parameter. The return value is an
  object with a single key, "notifications" (an array of notification objects,
  usually just one element in this case).
 */
function deleteAuthorById(context) {
  const id = context.params.path.id;
  const res = context.res;

  return authors.deleteAuthor(id)
    .then((number) => {
      if (number) {
        res.status(200).pureJson({});
      } else {
        res.status(404)
          .pureJson({
            error: {
              summary: "Not found",
              description: `No author with this ID (${id}) found`,
            }
          });
      }
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        }
      });
    });
}

/*
  GET /author/{id}/withRefCount

  Fetch a single author by the ID. Returns an object with a single field,
  "author", whose value is the author object. Alias information is included.
  The author object has an additional field, "refcount" (integer), that has
  the number of references they are credited with.
 */
function getAuthorByIdWithRefCount(context) {
  const id = context.params.path.id;
  const res = context.res;

  return authors.fetchSingleAuthorWithRefCount(id)
    .then((author) => {
      if (author) {
        res.status(200).pureJson({ author });
      } else {
        res.status(404)
          .pureJson({
            error: {
              summary: "Not found",
              description: `No author with this ID (${id}) found`,
            }
          });
      }
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        }
      });
    });
}

/*
  GET /author/{id}/withRefsAndAliases

  Fetch a single author by the ID. The returned author record will have all
  alias information and a "references" key that has an array of Reference
  objects. The references list will be all references the author is credited
  on. The list is not ordered.
 */
function getAuthorByIdWithReferences(context) {
  const id = context.params.path.id;
  const res = context.res;

  return authors.fetchSingleAuthorComplex(id)
    .then((author) => {
      if (author) {
        res.status(200).pureJson({ author });
      } else {
        res.status(404)
          .pureJson({
            error: {
              summary: "Not found",
              description: `No author with this ID (${id}) found`,
            }
          });
      }
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          summary: error.name,
          description: error.message,
        }
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