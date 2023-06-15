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
  FeatureTagsMagazineFeatures,
  PhotoCollection,
  Magazine,
  MagazineIssue,
  Author,
  AuthorsReferences,
  TagsReferences,
  sequelize,
} = require("../models");

const shallowIncludesForReference = [
  ReferenceType,
  { model: Author, as: "Authors" },
  { model: Tag, as: "Tags" },
];
const includesForReference = [
  ...shallowIncludesForReference,
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
];
const INCLUDE_REFERENCES = {
  model: Reference,
  as: "References",
  include: includesForReference,
};

// Get a single reference with all ancillary data (type, magazine, authors).
async function fetchSingleReferenceComplete(id) {
  const reference = await Reference.findByPk(id, {
    include: includesForReference,
  });

  return reference?.clean();
}

// Get all the references (based on opts), with ReferenceType, Magazine and
// Author information. Returns the count, as well.
async function fetchAllReferencesComplete(opts = {}) {
  const results = await Reference.findAll({
    include: includesForReference,
    ...opts,
  });

  const references = results.map((reference) => reference.clean());

  return references;
}

// Create the linkage for a new reference to a Book structure.
async function createReferenceBook(transaction, referenceId, data) {
  const { isbn, publisherId, seriesId, seriesNumber } = data;

  return Book.create(
    { referenceId, isbn, publisherId, seriesId, seriesNumber },
    { transaction }
  );
}

// Create the linkage for a new reference to a MagazineFeature structure.
async function createReferenceMagazineFeature(transaction, referenceId, data) {
  const { magazineIssueId, featureTags } = data;

  const magazineFeature = MagazineFeature.create(
    { referenceId, magazineIssueId },
    { transaction }
  );

  const newFeatureTags = featureTags.map((featureTagId) => ({
    featureTagId,
    referenceId,
  }));
  FeatureTagsMagazineFeatures.bulkCreate(newFeatureTags, { transaction });

  return magazineFeature;
}

// Create the linkage for a new reference to a PhotoCollection structure.
async function createReferencePhotoCollection(transaction, referenceId, data) {
  const { photosLocation: location, photosMedia: media } = data;

  return PhotoCollection.create(
    { referenceId, location, media },
    { transaction }
  );
}

// Create a new reference using the content in data.
async function createReference(data) {
  // Pull out basic data (name, language, authors and tags).
  const { name, language, authors, tags } = data;

  // Convert this one.
  const referenceTypeId = parseInt(data.referenceTypeId, 10);

  const newReferenceId = await sequelize.transaction(async (transaction) => {
    // Start with the basic Reference record.
    const reference = await Reference.create(
      { name, language, referenceTypeId },
      { transaction }
    ).catch((error) => {
      if (error.hasOwnProperty("errors")) {
        const specific = error.errors[0];
        throw new Error(specific.message);
      } else {
        throw new Error(error.message);
      }
    });
    const referenceId = reference.id;

    // Connect the authors to the new reference.
    const newAuthors = authors.map((authorId) => ({ authorId, referenceId }));
    await AuthorsReferences.bulkCreate(newAuthors, { transaction });

    // Connect the tags.
    const newTags = tags.map((tagId) => ({ tagId, referenceId }));
    await TagsReferences.bulkCreate(newTags, { transaction });

    // Based on the type of reference, create the secondary record.
    switch (referenceTypeId) {
      case 1: // Book
        createReferenceBook(transaction, referenceId, data);
        break;
      case 2: // MagazineFeature
        createReferenceMagazineFeature(transaction, referenceId, data);
        break;
      case 3: // PhotoCollection
        createReferencePhotoCollection(transaction, referenceId, data);
        break;
      default:
        throw new Error("Unknown Reference type passed in");
    }

    return referenceId;
  });

  return fetchSingleReferenceComplete(newReferenceId);
}

// // Update the "basic" reference information.
// const updateReferenceBasicInfo = async (reference, data, transaction) => {
//   const { name, type, language } = data;

//   await reference.update({ name, type, language }, { transaction });
// };

// // Update the type-related reference information.
// const updateReferenceTypeInfo = async (reference, data, transaction) => {
//   const { ReferenceTypeId } = data;
//   const changes = {};

//   if (ReferenceTypeId !== reference.ReferenceTypeId) {
//     // The type has completely changed.
//     changes.ReferenceTypeId = ReferenceTypeId;
//   } else {
//     // The type has not changed, but other information might have.
//     switch (ReferenceTypeId) {
//       case 1:
//         // For a book, check only the ISBN.
//         if (data.isbn !== reference.isbn) changes.isbn = data.isbn;
//         break;
//       case 2:
//       case 3:
//         // For either magazine type check the magazine ID and the issue ID/num.
//         if (data.MagazineId !== reference.MagazineId)
//           changes.MagazineId = data.MagazineId;
//         break;
//       default:
//         // Other types have no other data.
//         break;
//     }
//   }
// };

// // Make any changes to the set of authors for the reference.
// const updateReferenceAuthorInfo = async (reference, data, transaction) => {
//   return;
// };

// // Make any changes to the set of tags for the reference.
// const updateReferenceTagInfo = async (reference, data, transaction) => {
//   return;
// };

// // Update a single reference using the content in data. This has to include
// // author data, author linkage, tags stuff and possible magazine issue linkage.
// const updateReference = async (id, data) => {
//   return Reference.findByPk(id, {
//     include: includesForReference,
//   }).then((reference) => {
//     return sequelize
//       .transaction(async (txn) => {
//         await updateReferenceBasicInfo(reference, data, txn);
//         await updateReferenceTypeInfo(reference, data, txn);
//         await updateReferenceAuthorInfo(reference, data, txn);
//         await updateReferenceTagInfo(reference, data, txn);
//       })
//       .then(() => fetchSingleReferenceComplete(id));
//   });
// };

// Delete a single Reference from the database.
async function deleteReference(id) {
  return Reference.destroy({ where: { id } });
}

module.exports = {
  shallowIncludesForReference,
  includesForReference,
  INCLUDE_REFERENCES,
  fetchSingleReferenceComplete,
  fetchAllReferencesComplete,
  createReference,
  // updateReference,
  deleteReference,
};
