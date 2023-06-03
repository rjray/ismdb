/*
 * All database operations that focus on magazines and issues.
 */

const {
  FeatureTag,
  Magazine,
  MagazineIssue,
  MagazineFeature,
  Reference,
  sequelize,
} = require("../models");
const { fixAggregateOrderFields } = require("../lib/utils");
const { includesForReference } = require("./references");

// Most-basic magazine request. Single magazine without issues or anything.
async function fetchSingleMagazineSimple(id) {
  const magazine = await Magazine.findByPk(id).catch((error) => {
    throw new Error(error);
  });

  return magazine?.clean();
}

// Get a single magazine with issues and references.
async function fetchSingleMagazineComplete(id) {
  const magazine = await Magazine.findByPk(id, {
    include: [
      {
        model: MagazineIssue,
        include: [
          {
            model: MagazineFeature,
            include: [{ model: Reference, include: includesForReference }],
          },
        ],
      },
    ],
  });

  return magazine?.clean();
}

// Get all magazines, with a count of their issues.
async function fetchAllMagazinesWithIssueCount(opts = {}) {
  if (opts.order) {
    // eslint-disable-next-line no-param-reassign
    opts.order = fixAggregateOrderFields(sequelize, opts.order, ["issuecount"]);
  }

  const results = await Magazine.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM \`MagazineIssues\`
            WHERE \`magazineId\` = Magazine.\`id\`
          )`),
          "issuecount",
        ],
      ],
    },
    ...opts,
  });

  const magazines = results.map((magazine) => magazine.clean());

  return magazines;
}

// Get all the magazines, along with all their issue numbers.
async function fetchAllMagazinesWithIssueNumbers(opts = {}) {
  const results = await Magazine.findAll({
    include: [{ model: MagazineIssue, attributes: ["id", "issue"] }],
    ...opts,
  });

  const magazines = results.map((magazine) => magazine.clean());

  return magazines;
}

// Create a new magazine using the content in `data`.
async function createMagazine(data) {
  const magazine = await Magazine.create(data).catch((error) => {
    if (error.hasOwnProperty("errors")) {
      const specific = error.errors[0];
      throw new Error(specific.message);
    } else {
      throw new Error(error.message);
    }
  });

  return magazine.clean();
}

// Update a single magazine using the content in `data`.
async function updateMagazine(id, data) {
  return Magazine.findByPk(id).then((magazine) => {
    return sequelize.transaction(async (txn) => {
      const updatedMagazine = await magazine.update(data, { transaction: txn });
      return updatedMagazine.clean();
    });
  });
}

// Delete a single Magazine record.
async function deleteMagazine(id) {
  return Magazine.destroy({ where: { id } });
}

// Create a MagazineIssue record.
async function createMagazineIssue(data) {
  const magazineissue = await MagazineIssue.create(data).catch((error) => {
    if (error.hasOwnProperty("errors")) {
      const specific = error.errors[0];
      throw new Error(specific.message);
    } else {
      throw new Error(error.message);
    }
  });

  return magazineissue.clean();
}

// Update a MagazineIssue record.
async function updateMagazineIssue(id, data) {
  return MagazineIssue.findByPk(id).then((magazineissue) => {
    return sequelize.transaction(async (txn) => {
      const updatedMagazineissue = await magazineissue.update(data, {
        transaction: txn,
      });
      return updatedMagazineissue.clean();
    });
  });
}

// Delete a single MagazineIssue record.
async function deleteMagazineIssue(id) {
  return MagazineIssue.destroy({ where: { id } });
}

// Fetch a single magazine issue with all the ancillary data.
async function fetchSingleMagazineIssueComplete(id) {
  const magazineissue = await MagazineIssue.findByPk(id, {
    include: [
      Magazine,
      {
        model: MagazineFeature,
        include: [
          { model: FeatureTag, as: "FeatureTags" },
          { model: Reference, include: includesForReference },
        ],
      },
    ],
  });

  return magazineissue?.clean();
}

module.exports = {
  fetchSingleMagazineSimple,
  fetchSingleMagazineComplete,
  fetchAllMagazinesWithIssueCount,
  fetchAllMagazinesWithIssueNumbers,
  createMagazine,
  updateMagazine,
  deleteMagazine,
  createMagazineIssue,
  updateMagazineIssue,
  deleteMagazineIssue,
  fetchSingleMagazineIssueComplete,
};
