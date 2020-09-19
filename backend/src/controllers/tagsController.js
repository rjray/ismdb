"use strict";

/*
  This is the exegesis controller module for all tag operations (all API
  paths at/below "/tag").
 */

const tags = require("../db/tags");

/*
  POST /tag

  Create a new tag record from the JSON content in the request body. The return
  value is an object with keys "tag" (new tag object) and "notifications" (an
  array of notification objects).
 */
function createTag(context) {
  const { res, requestBody } = context;

  return tags
    .createTag(requestBody)
    .then((tag) => {
      res.status(201).pureJson({ tag });
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
  GET /tag

  Return all tags, possibly limited by params passed in. Also returns a count
  of all tags that match the query, even if the query itself is governed by
  skip and/or limit. The returned object has keys "count" (integer) and "tags"
  (array of tag objects).
 */
function getAllTags(context) {
  const query = context.params.query;
  const res = context.res;

  return tags
    .fetchAllTagsWithCount()
    .then((results) => {
      res.status(200).pureJson(results);
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          sumary: error.name,
          description: error.message,
        },
      });
    });
}

/*
  GET /tag/withRefCount

  Return all tags, possibly limited by params passed in. Also returns a count
  of all tags that match the query, even if the query itself is governed by
  skip and/or limit. The returned object has keys "count" (integer) and "tags"
  (array of tag objects). Each tag object has an extra key, "refcount", that
  is the number of references tagged by this tag.
 */
function getAllTagsWithRefCount(context) {
  const query = context.params.query;
  const res = context.res;

  return tags
    .fetchAllTagsWithRefCountAndCount()
    .then((results) => {
      res.status(200).pureJson(results);
    })
    .catch((error) => {
      res.status(500).pureJson({
        error: {
          sumary: error.name,
          description: error.message,
        },
      });
    });
}

/*
  GET /tag/{id}

  Fetch a single tag by the ID. Returns an object with the single key "tag",
  whose value is the tag object.
 */
function getTagById(context) {
  const id = context.params.path.id;
  const res = context.res;

  return tags
    .fetchSingleTagSimple(id)
    .then((tag) => {
      if (tag) {
        res.status(200).pureJson({ tag });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No tag with this ID (${id}) found`,
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
  PUT /tag/{id}

  Update the tag specified by the ID parameter, using the data in the request
  body. The return value is an object with the keys "tag" (the updated tag
  object) and "notifications" (an array of notification objects, usually just
  one element in this case).
 */
function updateTagById(context) {
  const id = context.params.path.id;
  const { res, requestBody } = context;

  return tags
    .updateTag(id, requestBody)
    .then((tag) => {
      if (tag) {
        res.status(200).pureJson({ tag });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No tag with this ID (${id}) found`,
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
  DELETE /tag/{id}

  Delete the tag specified by the ID parameter. The return value is an object
  with a single key, "notifications" (an array of notification objects, usually
  just one element in this case).
 */
function deleteTagById(context) {
  const id = context.params.path.id;
  const res = context.res;

  return tags
    .deleteTag(id)
    .then((number) => {
      if (number) {
        res.status(200).pureJson({});
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No tag with this ID (${id}) found`,
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
  GET /tag/{id}/withRefCount

  Fetch a single tag by the ID. Returns an object with a single field,
  "tag", whose value is the tag object. The tag object has an additional field,
  "refcount" (integer), that has the number of references tagged with this tag.
 */
function getTagByIdWithRefCount(context) {
  const id = context.params.path.id;
  const res = context.res;

  return tags
    .fetchSingleTagWithRefCount(id)
    .then((tag) => {
      if (tag) {
        res.status(200).pureJson({ tag });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No tag with this ID (${id}) found`,
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
  GET /tag/{id}/withReferences

  Fetch a single tag by the ID. Returns an object with a single field, "tag",
  whose value is the tag object. The tag object has an additional field,
  "references", that is an array of the references tagged with this tag.
 */
function getTagByIdWithReferences(context) {
  const id = context.params.path.id;
  const res = context.res;

  return tags
    .fetchSingleTagWithReferences(id)
    .then((tag) => {
      if (tag) {
        res.status(200).pureJson({ tag });
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No tag with this ID (${id}) found`,
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
  createTag,
  getAllTags,
  getAllTagsWithRefCount,
  getTagById,
  updateTagById,
  deleteTagById,
  getTagByIdWithRefCount,
  getTagByIdWithReferences,
};
