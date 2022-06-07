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
const { shallowIncludesForReference } = require("./references");

// Most-basic magazine request. Single magazine without issues or anything.
const fetchSingleMagazineSimple = async (id) => {
  const magazine = await Magazine.findByPk(id).catch((error) => {
    throw new Error(error);
  });

  return magazine?.clean();
};

// Get a single magazine with issues and references.
const fetchSingleMagazineComplete = async (id) => {
  const magazine = await Magazine.findByPk(id, {
    include: [
      {
        model: MagazineIssue,
        include: [
          {
            model: MagazineFeature,
            include: [
              { model: Reference, include: shallowIncludesForReference },
            ],
          },
        ],
      },
    ],
  });

  return magazine?.clean();
};

// Get all magazines, with a count of their issues and a count of the total
// matching magazine records.
const fetchAllMagazinesWithIssueCountAndCount = async (optsIn = {}) => {
  const opts = { ...optsIn };
  const optsNoOrder = { ...optsIn };
  if (opts.order) {
    delete optsNoOrder.order;
    opts.order = fixAggregateOrderFields(sequelize, opts.order, ["issuecount"]);
  }

  const count = await Magazine.count(optsNoOrder);
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

  return { count, magazines };
};

// Get all the magazines, along with all their issue numbers and a count of all
// (matching) magazines.
const fetchAllMagazinesWithIssueNumbersAndCount = async (opts = {}) => {
  const count = await Magazine.count(opts);
  const results = await Magazine.findAll({
    include: [{ model: MagazineIssue, attributes: ["id", "number"] }],
    ...opts,
  });

  const magazines = results.map((magazine) => magazine.clean());

  return { count, magazines };
};

// Create a new magazine using the content in data.
const createMagazine = async (data) => {
  const magazine = await Magazine.create(data).catch((error) => {
    if (error.hasOwnProperty("errors")) {
      const specific = error.errors[0];
      throw new Error(specific.message);
    } else {
      throw new Error(error.message);
    }
  });

  return magazine.clean();
};

// Update a single magazine using the content in data.
const updateMagazine = async (id, data) => {
  return Magazine.findByPk(id).then((magazine) => {
    return sequelize.transaction(async (txn) => {
      const updatedMagazine = await magazine.update(data, { transaction: txn });
      return updatedMagazine.clean();
    });
  });
};

// Delete a single Magazine record.
const deleteMagazine = async (id) => {
  return Magazine.destroy({ where: { id } });
};

// Create a MagazineIssue record.
const createMagazineIssue = async (data) => {
  const magazineissue = await MagazineIssue.create(data).catch((error) => {
    if (error.hasOwnProperty("errors")) {
      const specific = error.errors[0];
      throw new Error(specific.message);
    } else {
      throw new Error(error.message);
    }
  });

  return magazineissue.clean();
};

// Update a MagazineIssue record.
const updateMagazineIssue = async (id, data) => {
  return MagazineIssue.findByPk(id).then((magazineissue) => {
    return sequelize.transaction(async (txn) => {
      const updatedMagazineissue = await magazineissue.update(data, {
        transaction: txn,
      });
      return updatedMagazineissue.clean();
    });
  });
};

// Delete a single MagazineIssue record.
const deleteMagazineIssue = async (id) => {
  return MagazineIssue.destroy({ where: { id } });
};

// Fetch a single magazine issue with all the ancillary data.
const fetchSingleMagazineIssueComplete = async (id) => {
  const magazineissue = await MagazineIssue.findByPk(id, {
    include: [
      Magazine,
      {
        model: MagazineFeature,
        include: [
          { model: FeatureTag, as: "FeatureTags" },
          { model: Reference, include: shallowIncludesForReference },
        ],
      },
    ],
  });

  return magazineissue?.clean();
};

module.exports = {
  fetchSingleMagazineSimple,
  fetchSingleMagazineComplete,
  fetchAllMagazinesWithIssueCountAndCount,
  fetchAllMagazinesWithIssueNumbersAndCount,
  createMagazine,
  updateMagazine,
  deleteMagazine,
  createMagazineIssue,
  updateMagazineIssue,
  deleteMagazineIssue,
  fetchSingleMagazineIssueComplete,
};
