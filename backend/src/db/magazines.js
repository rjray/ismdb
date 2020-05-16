/*
 * All database operations that focus on magazines and issues.
 */

const {
  Magazine,
  MagazineIssue,
  Reference,
  RecordType,
  Author,
  sequelize,
} = require("../models");

// Most-basic magazine request. Single magazine without issues or anything.
const fetchSingleMagazineSimple = async (id) => {
  let magazine = await Magazine.findByPk(id).catch((error) => {
    throw new Error(error);
  });

  if (magazine) {
    magazine = magazine.get();
  } else {
    throw new Error(`No magazine with id "${id}" found`);
  }

  return magazine;
};

// Get a single magazine with issues and references.
const fetchSingleMagazineComplete = async (id) => {
  let magazine = await Magazine.findByPk(id, {
    include: [{ model: MagazineIssue, include: [Reference] }],
  });

  magazine = magazine.get();
  magazine.issues = magazine.MagazineIssues.map((issue) => {
    issue = issue.get();
    delete issue.MagazineId;
    issue.references = issue.References.map((reference) => reference.get());
    delete issue.References;

    return issue;
  });

  return magazine;
};

// Get all magazines, with a count of their issues.
const fetchAllMagazinesWithIssueCount = async (id, opts = {}) => {
  let magazines = await Magazine.findAll({
    include: [{ model: MagazineIssue, attributes: ["id"] }],
    ...opts,
  });

  magazines = magazines.map((magazine) => {
    magazine = magazine.get();
    magazine.issues = magazine.MagazineIssues.length;
    delete magazine.MagazineIssues;
    return magazine;
  });

  return magazines;
};

// Get all the magazines, along with all their issue numbers.
const fetchAllMagazinesWithIssueNumbers = async (opts = {}) => {
  return Magazine.findAll({
    order: ["name"],
    include: [{ model: MagazineIssue, attributes: ["number"] }],
    ...opts,
  });
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

      magazine = await magazine.update(data);
      return magazine.get();
    });
  });
};

// Delete a single Magazine record.
const deleteMagazine = async (id) => {
  return Magazine.destroy({ where: { id } });
};

// Delete a single MagazineIssue record.
const deleteMagazineIssue = async (id) => {
  return MagazineIssue.destroy({ where: { id } });
};

// Fetch a single magazine issue with all the ancillary data.
const fetchSingleMagazineIssueComplete = async (id) => {
  let magazineissue = await MagazineIssue.findByPk(id, {
    include: [
      Magazine,
      {
        model: Reference,
        include: [
          RecordType,
          {
            model: MagazineIssue,
            include: [Magazine],
          },
          {
            model: Author,
            as: "Authors",
          },
        ],
      },
    ],
  });

  magazineissue = magazineissue.get();

  magazineissue.Magazine = magazineissue.Magazine.get();
  magazineissue.References = magazineissue.References.map((reference) => {
    reference = reference.get();

    if (reference.MagazineIssue) {
      reference.Magazine = reference.MagazineIssue.Magazine.get();
      reference.MagazineIssue = reference.MagazineIssue.get();
      delete reference.MagazineIssue.Magazine;
    }
    reference.RecordType = reference.RecordType.get();

    return reference;
  });

  return magazineissue;
};

module.exports = {
  fetchSingleMagazineSimple,
  fetchSingleMagazineComplete,
  fetchAllMagazinesWithIssueCount,
  fetchAllMagazinesWithIssueNumbers,
  createMagazine,
  updateMagazine,
  deleteMagazine,
  deleteMagazineIssue,
  fetchSingleMagazineIssueComplete,
};
