/*
 * All database operations that focus on references.
 */

const {
  Reference,
  RecordType,
  MagazineIssue,
  Magazine,
  Author,
  sequelize,
} = require("../models")

// Most-basic reference request. Single reference, with only the RecordType and
// (if relevant) MagazineIssue+Magazine joins.
const fetchSingleReferenceSimple = async id => {
  let reference = await Reference.findByPk(id, {
    include: [RecordType, { model: MagazineIssue, include: [Magazine] }],
  })
  reference = reference.get()

  if (reference.MagazineIssue) {
    reference.Magazine = reference.MagazineIssue.Magazine.get()
    reference.MagazineIssue = reference.MagazineIssue.get()
    delete reference.MagazineIssue.Magazine
  }
  reference.RecordType = reference.RecordType.get()

  return reference
}

// Get a single reference with all ancillary data (type, magazine, authors).
const fetchSingleReferenceComplete = async id => {
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
  })
  reference = reference.get()

  reference.authors = reference.Authors.sort(
    (a, b) => a.AuthorsReferences.order - b.AuthorsReferences.order
  ).map(author => {
    author = author.get()
    author.order = author.AuthorsReferences.order
    delete author.AuthorsReferences
    return author
  })
  delete reference.Authors

  if (reference.MagazineIssue) {
    reference.Magazine = reference.MagazineIssue.Magazine.get()
    reference.MagazineIssue = reference.MagazineIssue.get()
    delete reference.MagazineIssue.Magazine
  }

  return reference
}

// Get all references with RecordType and Magazine info. Like calling
// fetchSingleReferenceSimple() for all refs.
const fetchAllReferencesSimple = async (opts = {}) => {
  let references = await Reference.findAll({
    include: [RecordType, { model: MagazineIssue, include: [Magazine] }],
    ...opts,
  })

  references = references.map(item => {
    let reference = item.get()

    if (reference.MagazineIssue) {
      reference.Magazine = reference.MagazineIssue.Magazine.get()
      reference.MagazineIssue = reference.MagazineIssue.get()
      delete reference.MagazineIssue.Magazine
    }
    reference.RecordType = reference.RecordType.get()

    return reference
  })

  return references
}

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
  }).then(reference => {
    return sequelize.transaction(async txn => {
      let updates = {},
        authToDelete = [],
        authToAdd = []

      // Build up the initial fields to update.
      for (let key of ["type", "language", "keywords", "name"]) {
        if (data[key] !== reference[key]) {
          updates[key] = data[key]
        }
      }
      // This always updates.
      updates.updatedAt = new Date()

      // Check for the type of record to have changed.
      const newRecordTypeId = Number(data.RecordTypeId)
      if (newRecordTypeId !== reference.RecordTypeId) {
        updates.RecordTypeId = newRecordTypeId

        if (newRecordTypeId === 1) {
          // This is now a book. This is easy, just null out the issue ID and
          // add the ISBN.
          updates.MagazineIssueId = null
          updates.isbn = data.isbn
        } else if (newRecordTypeId === 2 || newRecordTypeId === 3) {
          // This is now a magazine feature or placeholder. But it isn't enough
          // to just null out the ISBN-- also have to locate the issue ID of
          // the specified magazine/issue #, possibly creating a new issue
          // record.
          updates.isbn = null
        } else {
          // This is something else entirely
          updates.MagazineIssueId = null
          updates.isbn = null
        }
      }
    })
  })
}

module.exports = {
  fetchSingleReferenceSimple,
  fetchSingleReferenceComplete,
  fetchAllReferencesSimple,
  updateReference,
}
