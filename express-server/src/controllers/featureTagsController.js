/*
  This is the exegesis controller module for all feature tag operations (all API
  paths at/below "/featuretags").
 */

const FeatureTags = require("../db/featuretags");
const { fixupOrderField } = require("../lib/utils");

/*
  POST /featuretags

  Create a new feature tag record from the JSON content in the request body.
  The return value is the new feature tag object.
 */
function createFeatureTag(context) {
  const { res, requestBody } = context;

  return FeatureTags.createFeatureTag(requestBody)
    .then((featureTag) => {
      res.status(201).pureJson(featureTag);
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
  GET /featuretags

  Return all feature tags, possibly limited by params passed in. The returned
  value is an array of feature tag objects.
 */
function getAllFeatureTags(context) {
  const { query } = context.params;
  const { res } = context;

  if (query.order) {
    query.order = fixupOrderField(query.order);
  }

  return FeatureTags.fetchAllFeatureTags(query)
    .then((featureTags) => {
      res.status(200).pureJson(featureTags);
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
  GET /featuretags/withRefCount

  Return all feature tags, possibly limited by params passed in. The returned
  value is the array of feature tag objects. Each feature tag object has an
  extra key, "refcount", that is the number of references tagged by this feature
  tag.
 */
function getAllFeatureTagsWithRefCount(context) {
  const { query } = context.params;
  const { res } = context;

  if (query.order) {
    query.order = fixupOrderField(query.order);
  }

  return FeatureTags.fetchAllFeatureTagsWithRefCount(query)
    .then((featureTags) => {
      res.status(200).pureJson(featureTags);
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
  GET /featuretags/{id}

  Fetch a single feature tag by the ID. Returns the feature tag object.
 */
function getFeatureTagById(context) {
  const { id } = context.params.path;
  const { res } = context;

  return FeatureTags.fetchSingleFeatureTagSimple(id)
    .then((featureTag) => {
      if (featureTag) {
        res.status(200).pureJson(featureTag);
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No feature tag with this ID (${id}) found`,
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
  PUT /featuretags/{id}

  Update the feature tag specified by the ID parameter, using the data in the
  request body. The return value is the updated feature tag object.
 */
function updateFeatureTagById(context) {
  const { id } = context.params.path;
  const { res, requestBody } = context;

  return FeatureTags.updateFeatureTag(id, requestBody)
    .then((featureTag) => {
      if (featureTag) {
        res.status(200).pureJson(featureTag);
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No feature tag with this ID (${id}) found`,
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
  DELETE /featuretags/{id}

  Delete the feature tag specified by the ID parameter. No return value.
 */
function deleteFeatureTagById(context) {
  const { id } = context.params.path;
  const { res } = context;

  return FeatureTags.deleteFeatureTag(id)
    .then((number) => {
      if (number) {
        res.status(200);
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No feature tag with this ID (${id}) found`,
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
  GET /featuretags/{id}/withRefCount

  Fetch a single feature tag by the ID. Returns the feature tag object. The
  object has an additional field, "refcount" (integer), that has the number of
  references tagged with this feature tag.
 */
function getFeatureTagByIdWithRefCount(context) {
  const { id } = context.params.path;
  const { res } = context;

  return FeatureTags.fetchSingleFeatureTagWithRefCount(id)
    .then((featureTag) => {
      if (featureTag) {
        res.status(200).pureJson(featureTag);
      } else {
        res.status(404).pureJson({
          error: {
            summary: "Not found",
            description: `No feature tag with this ID (${id}) found`,
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
  createFeatureTag,
  getAllFeatureTags,
  getAllFeatureTagsWithRefCount,
  getFeatureTagById,
  updateFeatureTagById,
  deleteFeatureTagById,
  getFeatureTagByIdWithRefCount,
};
