"use strict";

/*
  This is the exegesis controller module for all tag operations (all API
  paths at/below "/tag").
 */

const tags = require("../db/tags");
const { fixupOrderField, fixupWhereField } = require("../lib/utils");

const canBeNull = new Set(["description", "type"]);

/*
  POST /tags

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
  GET /tags

  Return all tags, possibly limited by params passed in. Also returns a count
  of all tags that match the query, even if the query itself is governed by
  skip and/or limit. The returned object has keys "count" (integer) and "tags"
  (array of tag objects).
 */
function getAllTags(context) {
  const query = context.params.query;
  const res = context.res;

  if (query.order) {
    query.order = fixupOrderField(query.order);
  }
  if (query.where) {
    query.where = fixupWhereField(query.where, canBeNull);
  }

  return tags
    .fetchAllTagsWithCount(query)
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
  GET /tags/withRefCount

  Return all tags, possibly limited by params passed in. Also returns a count
  of all tags that match the query, even if the query itself is governed by
  skip and/or limit. The returned object has keys "count" (integer) and "tags"
  (array of tag objects). Each tag object has an extra key, "refcount", that
  is the number of references tagged by this tag.
 */
function getAllTagsWithRefCount(context) {
  const query = context.params.query;
  const res = context.res;

  if (query.order) {
    query.order = fixupOrderField(query.order);
  }
  if (query.where) {
    query.where = fixupWhereField(query.where, canBeNull);
  }

  return tags
    .fetchAllTagsWithRefCountAndCount(query)
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
  GET /tags/queryWithRefcount

  A specialized form of getAllTagsWithRefCount(), that only queries against
  the name field. Also returns a count of all tags that match the query, even
  if the query itself is governed by skip and/or limit. The returned object has
  keys "count" (integer) and "tags" (array of tag objects). Each tag object has
  an extra key, "refcount", that\ is the number of references tagged by this
  tag.
 */
function getTagsQueryWithRefCount(context) {
  const query = context.params.query;
  const res = context.res;

  if (query.order) {
    query.order = fixupOrderField(query.order);
  } else {
    query.order = ["name"];
  }

  query.where = fixupWhereField([`name,substring,${query.query}`]);
  delete query.query;

  return tags
    .fetchAllTagsWithRefCountAndCount(query)
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
  GET /tags/{id}

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
  PUT /tags/{id}

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
  DELETE /tags/{id}

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
  GET /tags/{id}/withRefCount

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
  GET /tags/{id}/withReferences

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
  getTagsQueryWithRefCount,
  getTagById,
  updateTagById,
  deleteTagById,
  getTagByIdWithRefCount,
  getTagByIdWithReferences,
};
