/*
 * /api/update/author
 */

const express = require("express")

const { Author, AuthorAlias, sequelize } = require("../../../models")

const router = express.Router()

router.post("/", (req, res) => {
  const { action, id, ...body } = req.body

  if (action !== "update") {
    res.send({
      status: "error",
      error: { message: "Invalid data packet for update" },
    })
  }

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
