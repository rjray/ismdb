/*
 * All database operations that focus on references.
 */

const {
  Reference,
  RecordType,
  Tag,
  MagazineIssue,
  Magazine,
  Author,
  AuthorsReferences,
  TagsReferences,
  sequelize,
} = require("../models");

const includesForReference = [
  RecordType,
  { model: MagazineIssue, include: [Magazine] },
  { model: Author, as: "Authors" },
  { model: Tag, as: "Tags" },
];
const INCLUDE_REFERENCES = {
  model: Reference,
  as: "References",
  include: includesForReference,
};

// "Clean" a reference record by stripping it down to a plain JS object.
function cleanReference(reference) {
  reference = reference.get();

  if (reference.Authors) {
    reference.authors = reference.Authors.sort(
      (a, b) => a.AuthorsReferences.order - b.AuthorsReferences.order
    ).map((author) => {
      author = author.get();
      author.order = author.AuthorsReferences.order;
      delete author.AuthorsReferences;
      return author;
    });
    delete reference.Authors;
  }

  if (reference.Tags) {
    reference.tags = reference.Tags.map((tag) => {
      tag = tag.get();
      delete tag.TagsReferences;
      return tag;
    });
    delete reference.Tags;
    delete reference.TagsReferences;
  }

  if (reference.MagazineIssue) {
    reference.Magazine = reference.MagazineIssue.Magazine.get();
    reference.MagazineIssue = reference.MagazineIssue.get();
    delete reference.MagazineIssue.Magazine;
  }

  reference.RecordType = reference.RecordType.get();

  return reference;
}

// Get a single reference with all ancillary data (type, magazine, authors).
const fetchSingleReferenceComplete = async (id) => {
  let reference = await Reference.findByPk(id, {
    include: includesForReference,
  });

  return reference ? cleanReference(reference) : reference;
};

// Get all the references (based on opts), with RecordType, Magazine and
// Author information. Returns the count, as well.
const fetchAllReferencesCompleteWithCount = async (opts = {}) => {
  const count = await Reference.count(opts);
  const results = await Reference.findAll({
    include: includesForReference,
    ...opts,
  });

  const references = results.map((reference) => cleanReference(reference));

  return { count, references };
};

// Create a new reference using the content in data.
const createReference = async (data) => {
  console.log(JSON.stringify(data, null, 2));
  // The notifications array will tell the front-end if anything extra was
  // done, such as creating new authors and/or tags.
  const notifications = [];

  // Remove the authors, that will be processed separately.
  const authors = data.authors.filter((author) => !author.deleted);
  delete data.authors;

  // Likewise, tags will be handled separately.
  const tags = data.tags;
  delete data.tags;

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

    // Connect the authors to the new reference, creating new ones as needed.
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
        // A new author. Must be created.
        const newAuthor = await Author.create({ name: author.name });
        notifications.push({
          type: "success",
          summary: "Author creation success",
          message: `Author "${author.name}" successfully created`,
        });
        newAuthors.push({
          authorId: newAuthor.id,
          referenceId: newReference.id,
          order: authorIndex,
        });
      }
      authorIndex++;
    }
    await AuthorsReferences.bulkCreate(newAuthors, { transaction: txn });

    const newTags = [];
    for (const tag of tags) {
      if (tag.id) {
        // This is an existing tag, so just create the new TagsReferences struct
        // directly from the data.
        newTags.push({
          tagId: tag.id,
          referenceId: newReference.id,
        });
      } else {
        // A new tag. Needs to be created.
        const newTag = await Tag.create({ name: tag.name });
        notifications.push({
          type: "success",
          summary: "Tag creation success",
          message: `Tag "${tag.name}" successfully created`,
        });
        newTags.push({
          tagId: newTag.id,
          referenceId: newReference.id,
        });
      }
    }
    await TagsReferences.bulkCreate(newTags, { transaction: txn });

    return newReference.id;
  });

  const reference = await fetchSingleReferenceComplete(newId);

  return { reference, notifications };
};

// Update a single reference using the content in data. This has to include
// author data, author linkage, and possible magazine issue linkage.
const updateReference = async (id, data) => {
  return Reference.findByPk(id, {
    include: includesForReference,
  }).then((reference) => {
    return sequelize.transaction(async (txn) => {
      let updates = {},
        authToDelete = [],
        authToAdd = [];

      // Build up the initial fields to update.
      for (let key of ["type", "language", "name"]) {
        if (data[key] !== reference[key]) {
          updates[key] = data[key];
        }
      }

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
  INCLUDE_REFERENCES,
  cleanReference,
  fetchSingleReferenceComplete,
  fetchAllReferencesCompleteWithCount,
  createReference,
  updateReference,
  deleteReference,
};
