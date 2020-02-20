/*
 * All database operations that focus on authors.
 */

const _ = require("lodash")

const {
  Author,
  AuthorAlias,
  Reference,
  RecordType,
  Magazine,
  MagazineIssue,
} = require("../models")

// Most-basic author request. Single author with any aliases.
const fetchSingleAuthorSimple = async id => {
  let author = await Author.findByPk(id, { include: [AuthorAlias] }).catch(
    error => {
      throw new Error(error)
    }
  )

  if (author) {
    author = author.get()
    author.aliases = author.AuthorAliases.map(item => {
      item = item.get()
      delete item.AuthorId
      return item
    })
    delete author.AuthorAliases
    author.aliases = _.sortBy(author.aliases, o => o.name)
  } else {
    throw new Error(`No author with id "${id}" found`)
  }

  return author
}

module.exports = { fetchSingleAuthorSimple }
