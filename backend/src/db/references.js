/*
 * All database operations that focus on references.
 */

const {
  Reference,
  ReferenceType,
  Tag,
  Book,
  Series,
  Publisher,
  MagazineFeature,
  FeatureTag,
  PhotoCollection,
  Magazine,
  MagazineIssue,
  Author,
  AuthorsReferences,
  TagsReferences,
  sequelize,
} = require("../models");

const includesForReference = [
  ReferenceType,
  {
    model: Book,
    include: [Series, Publisher],
  },
  {
    model: MagazineFeature,
    include: [
      { model: FeatureTag, as: "FeatureTags" },
      { model: MagazineIssue, include: [Magazine] },
    ],
  },
  PhotoCollection,
  { model: Author, as: "Authors" },
  { model: Tag, as: "Tags" },
];
const INCLUDE_REFERENCES = {
  model: Reference,
  as: "References",
  include: includesForReference,
};

// Get a single reference with all ancillary data (type, magazine, authors).
const fetchSingleReferenceComplete = async (id) => {
  const reference = await Reference.findByPk(id, {
    include: includesForReference,
  });

  return reference ? reference.clean() : reference;
};

// Get all the references (based on opts), with ReferenceType, Magazine and
// Author information. Returns the count, as well.
const fetchAllReferencesCompleteWithCount = async (opts = {}) => {
  const count = await Reference.count(opts);
  const results = await Reference.findAll({
    include: includesForReference,
    ...opts,
  });

  const references = results.map((reference) => reference.clean());

  return { count, references };
};

// Create a new reference using the content in data.
const createReference = async (dataIn) => {
  const data = { ...dataIn };

  // The notifications array will tell the front-end if anything extra was
  // done, such as creating new authors and/or tags.
  const notifications = [];
  // Keep a count of any added authors, so that the front-end can know to
  // invalidate the cache of author data.
  let addedAuthors = 0;

  // Remove the authors, that will be processed separately.
  const authors = data.authors.filter((author) => !author.deleted);
  delete data.authors;

  // Likewise, tags will be handled separately.
  const { tags } = data;
  delete data.tags;

  // Convert this one.
  data.ReferenceTypeId = parseInt(data.ReferenceTypeId, 10);

  // These are not used directly in the creation of a Reference instance, but
  // will be needed if the record type is a magazine.
  const magazineIssueNumber = data.MagazineIssueNumber;
  delete data.MagazineIssueNumber;
  const magazineId = data.MagazineId;
  delete data.MagazineId;

  const newId = await sequelize.transaction(async (txn) => {
    // Start by leveling things out a bit based on the record type.
    if (data.ReferenceTypeId === 1) {
      // A book. Clear magazine-related values.
      data.MagazineIssueId = null;
    } else if (data.ReferenceTypeId === 2 || data.ReferenceTypeId === 3) {
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
    for (const author of authors) {
      if (author.id) {
        // This is an existing author, so just create the new AuthorsReferences
        // struct directly from the data.
        newAuthors.push({
          authorId: author.id,
          referenceId: newReference.id,
        });
      } else {
        // A new author. Must be created.
        // eslint-disable-next-line no-await-in-loop
        const newAuthor = await Author.create({ name: author.name });
        notifications.push({
          type: "success",
          summary: "Author creation success",
          message: `Author "${author.name}" successfully created`,
        });
        newAuthors.push({
          authorId: newAuthor.id,
          referenceId: newReference.id,
        });
        addedAuthors++;
      }
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
        // eslint-disable-next-line no-await-in-loop
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

  return { reference, notifications, addedAuthors };
};

// Update the "basic" reference information.
const updateReferenceBasicInfo = async (reference, data, transaction) => {
  const { name, type, language } = data;

  await reference.update({ name, type, language }, { transaction });
};

// Update the type-related reference information.
const updateReferenceTypeInfo = async (reference, data, transaction) => {
  const { ReferenceTypeId } = data;
  const changes = {};

  if (ReferenceTypeId !== reference.ReferenceTypeId) {
    // The type has completely changed.
    changes.ReferenceTypeId = ReferenceTypeId;
  } else {
    // The type has not changed, but other information might have.
    switch (ReferenceTypeId) {
      case 1:
        // For a book, check only the ISBN.
        if (data.isbn !== reference.isbn) changes.isbn = data.isbn;
        break;
      case 2:
      case 3:
        // For either magazine type check the magazine ID and the issue ID/num.
        if (data.MagazineId !== reference.MagazineId)
          changes.MagazineId = data.MagazineId;
        break;
      default:
        // Other types have no other data.
        break;
    }
  }
};

// Make any changes to the set of authors for the reference.
const updateReferenceAuthorInfo = async (reference, data, transaction) => {
  return;
};

// Make any changes to the set of tags for the reference.
const updateReferenceTagInfo = async (reference, data, transaction) => {
  return;
};

// Update a single reference using the content in data. This has to include
// author data, author linkage, tags stuff and possible magazine issue linkage.
const updateReference = async (id, data) => {
  return Reference.findByPk(id, {
    include: includesForReference,
  }).then((reference) => {
    return sequelize
      .transaction(async (txn) => {
        await updateReferenceBasicInfo(reference, data, txn);
        await updateReferenceTypeInfo(reference, data, txn);
        await updateReferenceAuthorInfo(reference, data, txn);
        await updateReferenceTagInfo(reference, data, txn);
      })
      .then(() => fetchSingleReferenceComplete(id));
  });
};

// Delete a single Reference from the database.
const deleteReference = async (id) => Reference.destroy({ where: { id } });

module.exports = {
  INCLUDE_REFERENCES,
  fetchSingleReferenceComplete,
  fetchAllReferencesCompleteWithCount,
  createReference,
  updateReference,
  deleteReference,
};
