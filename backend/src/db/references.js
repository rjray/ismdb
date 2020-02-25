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
const fetchAllReferencesSimple = async () => {
  let references = await Reference.findAll({
    include: [RecordType, { model: MagazineIssue, include: [Magazine] }],
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

module.exports = {
  fetchSingleReferenceSimple,
  fetchSingleReferenceComplete,
  fetchAllReferencesSimple,
}
