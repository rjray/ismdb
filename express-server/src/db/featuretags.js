/*
 * All database operations that focus on feature tags.
 */

const { FeatureTag, sequelize } = require("../models");
const { fixAggregateOrderFields } = require("../lib/utils");

// Basic feature tag request: just the requested feature tag.
async function fetchSingleFeatureTagSimple(id) {
  const featureTag = await FeatureTag.findByPk(id).catch((error) => {
    throw new Error(error);
  });

  return featureTag?.clean();
}

// Fetch a specific feature tag with the count of associated references as
// "refcount".
async function fetchSingleFeatureTagWithRefCount(id) {
  const featureTag = await FeatureTag.findByPk(id, {
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM \`FeatureTagsMagazineFeatures\`
            WHERE \`featureTagId\` = FeatureTag.\`id\`
          )`),
          "refcount",
        ],
      ],
    },
  }).catch((error) => {
    throw new Error(error);
  });

  return featureTag?.clean();
}

// Fetch all feature tags as an array.
async function fetchAllFeatureTags(opts = {}) {
  const results = await FeatureTag.findAll({
    ...opts,
  }).catch((error) => {
    throw new Error(error);
  });

  const featureTags = results.map((featureTag) => featureTag.clean());

  return featureTags;
}

// Fetch all feature tags as an array. Each tag object includes the count of
// associated references as "refcount".
async function fetchAllFeatureTagsWithRefCount(opts = {}) {
  if (opts.order) {
    // eslint-disable-next-line no-param-reassign
    opts.order = fixAggregateOrderFields(sequelize, opts.order, ["refcount"]);
  }

  const results = await FeatureTag.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM \`FeatureTagsMagazineFeatures\`
            WHERE \`featureTagId\` = FeatureTag.\`id\`
          )`),
          "refcount",
        ],
      ],
    },
    ...opts,
  }).catch((error) => {
    throw new Error(error);
  });

  const featureTags = results.map((featureTag) => featureTag.clean());

  return featureTags;
}

// Create a new tag using the content in data.
async function createFeatureTag(data) {
  const featureTag = await FeatureTag.create(data).catch((error) => {
    if (error.hasOwnProperty("errors")) {
      const specific = error.errors[0];
      throw new Error(specific.message);
    } else {
      throw new Error(error);
    }
  });

  return featureTag.clean();
}

// Update a single tag using the content in data.
async function updateFeatureTag(id, data) {
  return FeatureTag.findByPk(id).then((featureTag) => {
    return sequelize.transaction(async (txn) => {
      const updatedFeatureTag = await featureTag.update(data, {
        transaction: txn,
      });
      return updatedFeatureTag.clean();
    });
  });
}

// Delete a single tag from the database.
async function deleteFeatureTag(id) {
  return FeatureTag.destroy({ where: { id } });
}

module.exports = {
  fetchSingleFeatureTagSimple,
  fetchSingleFeatureTagWithRefCount,
  fetchAllFeatureTags,
  fetchAllFeatureTagsWithRefCount,
  createFeatureTag,
  updateFeatureTag,
  deleteFeatureTag,
};
