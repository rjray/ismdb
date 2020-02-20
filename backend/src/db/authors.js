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

function convertAliases(aliasList) {
  let aliases = aliasList.map(item => {
    item = item.get()
    delete item.AuthorId
    return item
  })
  aliases = _.sortBy(aliases, o => o.name)

  return aliases
}

// Most-basic author request. Single author with any aliases.
const fetchSingleAuthorSimple = async id => {
  let author = await Author.findByPk(id, { include: [AuthorAlias] }).catch(
    error => {
      throw new Error(error)
    }
  )

  if (author) {
    author = author.get()
    author.aliases = convertAliases(author.AuthorAliases)
    delete author.AuthorAliases
  } else {
    throw new Error(`No author with id "${id}" found`)
  }

  return author
}

const fetchSingleAuthorComplex = async id => {
  let author = await Author.findByPk(id, {
    include: [
      AuthorAlias,
      {
        model: Reference,
        as: "References",
        include: [RecordType, { model: MagazineIssue, include: [Magazine] }],
      },
    ],
  })

  if (author) {
    author = author.get()
    author.aliases = convertAliases(author.AuthorAliases)
    delete author.AuthorAliases

    author.references = author.References.map(item => {
      item = item.get()
      delete item.AuthorsReferences
      if (item.MagazineIssue) {
        item.Magazine = item.MagazineIssue.Magazine.get()
        item.MagazineIssue = item.MagazineIssue.get()
        delete item.MagazineIssue.Magazine
      }
      return item
    })
    delete author.References
  } else {
    throw new Error(`No author with id "${id}" found`)
  }

  return author
}

const fetchAllAuthorsWithRefcount = async () => {
  let authors = await Author.findAll({
    include: [
      AuthorAlias,
      { model: Reference, as: "References", attributes: ["id"] },
    ],
  })

  authors = authors.map(author => {
    author = author.get()
    author.aliases = convertAliases(author.AuthorAliases)
    delete author.AuthorAliases
    author.refcount = author.References.length
    delete author.References

    return author
  })

  return authors
}

module.exports = {
  fetchSingleAuthorSimple,
  fetchSingleAuthorComplex,
  fetchAllAuthorsWithRefcount,
}
