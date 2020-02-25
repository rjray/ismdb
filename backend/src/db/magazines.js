/*
 * All database operations that focus on magazines.
 */

const { Magazine, MagazineIssue, Reference, sequelize } = require("../models")

// Most-basic magazine request. Single magazine without issues or anything.
const fetchSingleMagazineSimple = async id => {
  let magazine = await Magazine.findByPk(id).catch(error => {
    throw new Error(error)
  })

  if (magazine) {
    magazine = magazine.get()
  } else {
    throw new Error(`No magazine with id "${id}" found`)
  }

  return magazine
}

// Get a single magazine with issues and references.
const fetchSingleMagazineComplete = async id => {
  let magazine = await Magazine.findByPk(id, {
    include: [{ model: MagazineIssue, include: [Reference] }],
  })

  magazine = magazine.get()
  magazine.issues = magazine.MagazineIssues.map(issue => {
    issue = issue.get()
    delete issue.MagazineId
    issue.references = issue.References.map(reference => reference.get())
    delete issue.References

    return issue
  })

  return magazine
}

// Get all magazines, with a count of their issues.
const fetchAllMagazinesWithIssueCount = async id => {
  let magazines = await Magazine.findAll({
    include: [{ model: MagazineIssue, attributes: ["id"] }],
  })

  magazines = magazines.map(magazine => {
    magazine = magazine.get()
    magazine.issues = magazine.MagazineIssues.length
    delete magazine.MagazineIssues
    return magazine
  })

  return magazines
}

// Update a single magazine using the content in data.
const updateMagazine = async (id, data) => {
  return Magazine.findByPk(id).then(magazine => {
    return sequelize.transaction(async txn => {
      data.createdAt = new Date(data.createdAt)
      // Since we're updating...
      data.updatedAt = new Date()

      magazine = await magazine.update(data)
      return magazine.get()
    })
  })
}

module.exports = {
  fetchSingleMagazineSimple,
  fetchSingleMagazineComplete,
  fetchAllMagazinesWithIssueCount,
  updateMagazine,
}
