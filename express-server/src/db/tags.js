/*
 * All database operations that focus on tags.
 */

const { Tag, sequelize } = require("../models");
const { fixAggregateOrderFields } = require("../lib/utils");

const { INCLUDE_REFERENCES } = require("./references");

// Basic tag request: just the requested tag.
async function fetchSingleTagSimple(id) {
  const tag = await Tag.findByPk(id).catch((error) => {
    throw new Error(error);
  });

  return tag?.clean();
}

// Fetch a specific tag with the count of associated references as "refcount".
async function fetchSingleTagWithRefCount(id) {
  const tag = await Tag.findByPk(id, {
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM \`TagsReferences\`
            WHERE \`tagId\` = Tag.\`id\`
          )`),
          "refcount",
        ],
      ],
    },
  }).catch((error) => {
    throw new Error(error);
  });

  return tag?.clean();
}

// Fetch a specific tag with all the tagged references.
async function fetchSingleTagWithReferences(id) {
  const tag = await Tag.findByPk(id, {
    include: [INCLUDE_REFERENCES],
  }).catch((error) => {
    throw new Error(error);
  });

  return tag?.clean();
}

// Fetch all tags as an array.
async function fetchAllTags(opts = {}) {
  const results = await Tag.findAll({
    ...opts,
  }).catch((error) => {
    throw new Error(error);
  });

  const tags = results.map((tag) => tag.clean());

  return tags;
}

// Fetch all tags as an array. Each tag object includes the count of associated
// references as "refcount".
async function fetchAllTagsWithRefCount(optsIn = {}) {
  const opts = { ...optsIn };
  if (opts.order) {
    opts.order = fixAggregateOrderFields(sequelize, opts.order, ["refcount"]);
  }

  const results = await Tag.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM \`TagsReferences\`
            WHERE \`tagId\` = Tag.\`id\`
          )`),
          "refcount",
        ],
      ],
    },
    ...opts,
  }).catch((error) => {
    throw new Error(error);
  });

  const tags = results.map((tag) => tag.clean());

  return tags;
}

// Create a new tag using the content in data.
async function createTag(data) {
  const tag = await Tag.create(data).catch((error) => {
    if (error.hasOwnProperty("errors")) {
      const specific = error.errors[0];
      throw new Error(specific.message);
    } else {
      throw new Error(error);
    }
  });

  return tag.clean();
}

// Update a single tag using the content in data.
async function updateTag(id, data) {
  return Tag.findByPk(id).then((tag) => {
    return sequelize.transaction(async (txn) => {
      const updatedTag = await tag.update(data, { transaction: txn });
      return updatedTag.clean();
    });
  });
}

// Delete a single tag from the database.
async function deleteTag(id) {
  return Tag.destroy({ where: { id } });
}

module.exports = {
  fetchSingleTagSimple,
  fetchSingleTagWithRefCount,
  fetchSingleTagWithReferences,
  fetchAllTags,
  fetchAllTagsWithRefCount,
  createTag,
  updateTag,
  deleteTag,
};
