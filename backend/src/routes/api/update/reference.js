/*
 * /api/update/reference
 */

const express = require("express")

const {
  Reference,
  Magazine,
  MagazineIssue,
  Author,
  sequelize,
} = require("../../../models")

const router = express.Router()

router.post("/", (req, res) => {
  const { action, id, ...body } = req.body

  if (action !== "update") {
    res.send({
      status: "error",
      error: { message: "Invalid data packet for update" },
    })
  }

  Reference.findByPk(id, {
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
    .then(reference => {
      // This was stringified for the form, coerce back to integer:
      const recordTypeId = +body.RecordTypeId
      const oldRecordTypeId = reference.RecordTypeId
      const oldMagazineIssue = reference.MagazineIssue
      const oldAuthors = reference.Authors.sort(
        (a, b) => a.AuthorsReferences.order - b.AuthorsReferences.order
      ).map(author => {
        author = author.get()
        author.order = author.AuthorsReferences.order
        delete author.AuthorsReferences
        return author
      })

      try {
        return sequelize.transaction(async txn => {
          // Start with the basic fields on the reference itself that may need
          // to be updated.
          let updates = {
            name: body.name,
            type: body.type,
            language: body.language,
            keywords: body.keywords,
            updatedAt: new Date(),
          }

          await reference.update(updates, { transaction: txn })

          // Water-down the reference object and return it as the result of a
          // successful update.

          res.send({ status: "success", reference })
        })
      } catch (error) {
        res.send({ status: "error", error })
      }
    })
    .catch(error => {
      res.send({ status: "error", error })
    })

  Author.findByPk(id, { include: [AuthorAlias] })
    .then(author => {
      try {
        return sequelize.transaction(async t => {
          if (body.name !== author.name) {
            await author.update({ name: body.name })
          }

          let aliases = {},
            toDelete = [],
            toAdd = [],
            toUpdate = []
          author.AuthorAliases.forEach(alias => (aliases[alias.id] = alias))

          // Gather those that should be deleted. This will create an array of
          // object due to using the table derived from author.
          body.aliases
            .filter(alias => alias.id != 0 && alias.deleted)
            .forEach(alias => {
              if (aliases.hasOwnProperty(alias.id)) {
                toDelete.push(aliases[alias.id])
              }
            })
          // Gather those that should be added. For this, we only need the name
          // field.
          body.aliases
            .filter(alias => alias.id == 0 && alias.name.length != 0)
            .forEach(alias => toAdd.push(alias.name))
          // Gather the ones that need to be updated. Here we use setName and
          // store the object itself (as taken from the table).
          body.aliases
            .filter(alias => alias.id != 0 && !alias.deleted)
            .forEach(alias => {
              if (aliases.hasOwnProperty(alias.id)) {
                if (aliases[alias.id].name != alias.name) {
                  let aliasToUpdate = aliases[alias.id]
                  aliasToUpdate.name = alias.name
                  toUpdate.push(aliasToUpdate)
                }
              }
            })

          for (let alias of toDelete) {
            await author.removeAuthorAlias(alias)
            await alias.destroy()
          }
          for (let alias of toUpdate) {
            await alias.save()
          }
          for (let name of toAdd) {
            await author.createAuthorAlias({ name: name })
          }

          let newAliases = await author.getAuthorAliases()
          author = author.get()
          delete author.AuthorAliases
          author.aliases = newAliases.map(alias => {
            return { name: alias.name, id: alias.id }
          })

          res.send({ status: "success", author })
        })
      } catch (error) {
        res.send({ status: "error", error })
      }
    })
    .catch(error => {
      res.send({ status: "error", error })
    })
})

module.exports = router
