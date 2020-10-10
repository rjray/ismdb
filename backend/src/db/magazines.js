/*
 * All database operations that focus on magazines and issues.
 */

const { Magazine, MagazineIssue, sequelize } = require("../models");
const { INCLUDE_REFERENCES, cleanReference } = require("./references");
const { fixAggregateOrderFields } = require("../lib/utils");

// Most-basic magazine request. Single magazine without issues or anything.
const fetchSingleMagazineSimple = async (id) => {
  let magazine = await Magazine.findByPk(id).catch((error) => {
    throw new Error(error);
  });

  if (magazine) {
    magazine = magazine.get();
  }

  return magazine;
};

// Get a single magazine with issues and references.
const fetchSingleMagazineComplete = async (id) => {
  let magazine = await Magazine.findByPk(id, {
    include: [{ model: MagazineIssue, include: [INCLUDE_REFERENCES] }],
  });

  if (magazine) {
    magazine = magazine.get();
    magazine.issues = magazine.MagazineIssues.map((issue) => {
      issue = issue.get();
      delete issue.MagazineId;
      issue.references = issue.References.map((reference) =>
        cleanReference(reference)
      );
      delete issue.References;

      return issue;
    });
    delete magazine.MagazineIssues;
  }

  return magazine;
};

// Get all magazines, with a count of their issues and a count of the total
// matching magazine records.
const fetchAllMagazinesWithIssueCountAndCount = async (opts = {}) => {
  const optsNoOrder = { ...opts };
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

  const magazines = results.map((magazine) => magazine.get());

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

  const magazines = results.map((magazine) => {
    magazine = magazine.get();
    magazine.issues = magazine.MagazineIssues;
    delete magazine.MagazineIssues;

    return magazine;
  });

  return { count, magazines };
};

// Create a new magazine using the content in data.
const createMagazine = async (data) => {
  // Explicitly set these.
  data.createdAt = new Date();
  data.updatedAt = new Date();

  const magazine = await Magazine.create(data).catch((error) => {
    if (error.hasOwnProperty("errors")) {
      const specific = error.errors[0];
      throw new Error(specific.message);
    } else {
      throw new Error(error.message);
    }
  });

  return magazine.get();
};

// Update a single magazine using the content in data.
const updateMagazine = async (id, data) => {
  return Magazine.findByPk(id).then((magazine) => {
    return sequelize.transaction(async (txn) => {
      data.createdAt = new Date(data.createdAt);
      // Since we're updating...
      data.updatedAt = new Date();

      magazine = await magazine.update(data, { transaction: txn });
      return magazine.get();
    });
  });
};

// Delete a single Magazine record.
const deleteMagazine = async (id) => {
  return Magazine.destroy({ where: { id } });
};

// Create a MagazineIssue record.
const createMagazineIssue = async (data) => {
  // Explicitly set these:
  data.createdAt = new Date();
  data.updatedAt = new Date();

  const magazineissue = await MagazineIssue.create(data).catch((error) => {
    if (error.hasOwnProperty("errors")) {
      const specific = error.errors[0];
      throw new Error(specific.message);
    } else {
      throw new Error(error.message);
    }
  });

  return magazineissue.get();
};

// Update a MagazineIssue record.
const updateMagazineIssue = async (id, data) => {
  return MagazineIssue.findByPk(id).then((magazineissue) => {
    return sequelize.transaction(async (txn) => {
      data.createdAt = new Date(data.createdAt);
      // Since we're updating...
      data.updatedAt = new Date();

      magazineissue = await magazineissue.update(data, { transaction: txn });
      return magazineissue.get();
    });
  });
};

// Delete a single MagazineIssue record.
const deleteMagazineIssue = async (id) => {
  return MagazineIssue.destroy({ where: { id } });
};

// Fetch a single magazine issue with all the ancillary data.
const fetchSingleMagazineIssueComplete = async (id) => {
  let magazineissue = await MagazineIssue.findByPk(id, {
    include: [Magazine, INCLUDE_REFERENCES],
  });

  magazineissue = magazineissue.get();

  magazineissue.Magazine = magazineissue.Magazine.get();
  delete magazineissue.MagazineId;
  magazineissue.references = magazineissue.References.map((reference) =>
    cleanReference(reference)
  );
  delete magazineissue.References;

  return magazineissue;
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
