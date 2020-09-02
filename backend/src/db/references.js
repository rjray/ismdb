/*
 * All database operations that focus on references.
 */

const {
  Reference,
  RecordType,
  MagazineIssue,
  Magazine,
  Author,
  AuthorsReferences,
  sequelize,
} = require("../models");

// LEGACY
// Most-basic reference request. Single reference, with only the RecordType and
// (if relevant) MagazineIssue+Magazine joins.
const fetchSingleReferenceSimple = async (id) => {
  let reference = await Reference.findByPk(id, {
    include: [RecordType, { model: MagazineIssue, include: [Magazine] }],
  });
  reference = reference.get();

  if (reference.MagazineIssue) {
    reference.Magazine = reference.MagazineIssue.Magazine.get();
    reference.MagazineIssue = reference.MagazineIssue.get();
    delete reference.MagazineIssue.Magazine;
  }
  reference.RecordType = reference.RecordType.get();

  return reference;
};

// Get a single reference with all ancillary data (type, magazine, authors).
const fetchSingleReferenceComplete = async (id) => {
  let reference = await Reference.findByPk(id, {
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
  });
  reference = reference.get();

  reference.authors = reference.Authors.sort(
    (a, b) => a.AuthorsReferences.order - b.AuthorsReferences.order
  ).map((author) => {
    author = author.get();
    author.order = author.AuthorsReferences.order;
    delete author.AuthorsReferences;
    return author;
  });
  delete reference.Authors;

  if (reference.MagazineIssue) {
    reference.Magazine = reference.MagazineIssue.Magazine.get();
    reference.MagazineIssue = reference.MagazineIssue.get();
    delete reference.MagazineIssue.Magazine;
  }

  return reference;
};

// Get all the references (based on opts), with RecordType, Magazine and
// Author information. Returns the count, as well.
const fetchAllReferencesCompleteWithCount = async (opts = {}) => {
  const count = await Reference.count(opts);
  const results = await Reference.findAll({
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
    ...opts,
  });

  const references = results.map((reference) => {
    reference = reference.get();

    reference.authors = reference.Authors.sort(
      (a, b) => a.AuthorsReferences.order - b.AuthorsReferences.order
    ).map((author) => {
      author = author.get();
      author.order = author.AuthorsReferences.order;
      delete author.AuthorsReferences;
      return author;
    });
    delete reference.Authors;

    if (reference.MagazineIssue) {
      reference.Magazine = reference.MagazineIssue.Magazine.get();
      reference.MagazineIssue = reference.MagazineIssue.get();
      delete reference.MagazineIssue.Magazine;
    }

    return reference;
  });

  return { count, references };
};

// LEGACY
// Get all references with RecordType and Magazine info. Like calling
// fetchSingleReferenceSimple() for all refs.
const fetchAllReferencesSimple = async (opts = {}) => {
  let references = await Reference.findAll({
    include: [RecordType, { model: MagazineIssue, include: [Magazine] }],
    ...opts,
  });

  references = references.map((item) => {
    const reference = item.get();

    if (reference.MagazineIssue) {
      reference.Magazine = reference.MagazineIssue.Magazine.get();
      reference.MagazineIssue = reference.MagazineIssue.get();
      delete reference.MagazineIssue.Magazine;
    }
    reference.RecordType = reference.RecordType.get();

    return reference;
  });

  return references;
};

// Create a new reference using the content in data.
const createReference = async (data) => {
  const notifications = [];
  const authorsAdded = [];

  // Explicitly set these.
  data.createdAt = new Date();
  data.updatedAt = new Date();

  // Remove the authors, that will be processed separately.
  const authors = data.authors.filter((author) => !author.deleted);
  delete data.authors;
  delete data.action;

  // Convert this one.
  data.RecordTypeId = parseInt(data.RecordTypeId, 10);

  // These are not used directly in the creation of a Reference instance, but
  // will be needed if the record type is a magazine.
  const magazineIssueNumber = data.MagazineIssueNumber;
  delete data.MagazineIssueNumber;
  const magazineId = data.MagazineId;
  delete data.MagazineId;

  const newId = await sequelize.transaction(async (txn) => {
    // Start by leveling things out a bit based on the record type.
    if (data.RecordTypeId === 1) {
      // A book. Clear magazine-related values.
      data.MagazineIssueId = null;
    } else if (data.RecordTypeId === 2 || data.RecordTypeId === 3) {
      // A magazine entry. Make sure ISBN is cleared, and convert the magazine
      // ID and issue number to the ID of a MagazineIssue instance.
      data.isbn = null;

      const magazineIssue = await MagazineIssue.findOne(
        { where: { magazineId, number: magazineIssueNumber } },
        { transaction: txn }
      );
      if (magazineIssue) {
        // It already exists
        data.MagazineIssueId = magazineIssue.id;
      } else {
        // Not found, so create it
        const newMagazineIssue = await MagazineIssue.create(
          { MagazineId: magazineId, number: magazineIssueNumber },
          { transaction: txn }
        ).catch((error) => {
          if (error.hasOwnProperty("errors")) {
            const specific = error.errors[0];
            throw new Error(specific.message);
          } else {
            throw new Error(error.message);
          }
        });
        data.MagazineIssueId = newMagazineIssue.id;
      }
    } else {
      // Something other than a book or magazine entry. Clear out those fields.
      data.isbn = null;
      data.MagazineIssueId = null;
    }

    // Should be able to create the Reference instance, now.
    const newReference = await Reference.create(data, {
      transaction: txn,
    }).catch((error) => {
      if (error.hasOwnProperty("errors")) {
        const specific = error.errors[0];
        throw new Error(specific.message);
      } else {
        throw new Error(error.message);
      }
    });

    // Connect the authors to the new reference
    const newAuthors = [];
    let authorIndex = 0;
    for (const author of authors) {
      if (author.id) {
        // This is an existing author, so just create the new AuthorsReferences
        // struct directly from the data.
        newAuthors.push({
          authorId: author.id,
          referenceId: newReference.id,
          order: authorIndex,
        });
      } else {
        // This author has no ID. Since the Typeahead widget handles the
        // onChange/onBlur for a name that is typed in without explicitly
        // selecting it, this can only mean a brand-new author.
        const newAuthor = await Author.create({ name: author.name });
        notifications.push({
          status: "success",
          result: "Creation success",
          resultMessage: `Author "${author.name}" successfully created`,
        });
        authorsAdded.push({ name: newAuthor.name, id: newAuthor.id });
        newAuthors.push({
          authorId: newAuthor.id,
          referenceId: newReference.id,
          order: authorIndex,
        });
      }
      authorIndex++;
    }

    await AuthorsReferences.bulkCreate(newAuthors, { transaction: txn });

    return newReference.id;
  });

  const reference = await fetchSingleReferenceComplete(newId);
  notifications.push({
    status: "success",
    result: "Creation success",
    resultMessage: `Reference "${reference.name}" successfully created`,
  });
  return { reference, authorsAdded, notifications };
};

// Update a single reference using the content in data. This has to include
// author data, author linkage, and possible magazine issue linkage.
const updateReference = async (id, data) => {
  return Reference.findByPk(id, {
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
  }).then((reference) => {
    return sequelize.transaction(async (txn) => {
      let updates = {},
        authToDelete = [],
        authToAdd = [];

      // Build up the initial fields to update.
      for (let key of ["type", "language", "keywords", "name"]) {
        if (data[key] !== reference[key]) {
          updates[key] = data[key];
        }
      }
      // This always updates.
      updates.updatedAt = new Date();

      // Check for the type of record to have changed.
      const newRecordTypeId = Number(data.RecordTypeId);
      if (newRecordTypeId !== reference.RecordTypeId) {
        updates.RecordTypeId = newRecordTypeId;

        if (newRecordTypeId === 1) {
          // This is now a book. This is easy, just null out the issue ID and
          // add the ISBN.
          updates.MagazineIssueId = null;
          updates.isbn = data.isbn;
        } else if (newRecordTypeId === 2 || newRecordTypeId === 3) {
          // This is now a magazine feature or placeholder. But it isn't enough
          // to just null out the ISBN-- also have to locate the issue ID of
          // the specified magazine/issue #, possibly creating a new issue
          // record.
          updates.isbn = null;
        } else {
          // This is something else entirely
          updates.MagazineIssueId = null;
          updates.isbn = null;
        }
      }
    });
  });
};

// Delete a single Reference from the database.
const deleteReference = async (id) => {
  return Reference.destroy({ where: { id } });
};

module.exports = {
  fetchSingleReferenceSimple,
  fetchSingleReferenceComplete,
  fetchAllReferencesCompleteWithCount,
  fetchAllReferencesSimple,
  createReference,
  updateReference,
  deleteReference,
};
