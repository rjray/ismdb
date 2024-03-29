/*
 * All database operations that focus on authors.
 */

const { Author, AuthorAlias, sequelize } = require("../models");
const { sortBy, fixAggregateOrderFields } = require("../lib/utils");
const { INCLUDE_REFERENCES } = require("./references");

const sortByName = sortBy("name");

// Most-basic author request. Single author with any aliases.
async function fetchSingleAuthorSimple(id) {
  const author = await Author.findByPk(id, { include: [AuthorAlias] }).catch(
    (error) => {
      throw new Error(error);
    }
  );

  return author?.clean();
}

// Single author with any aliases and a count of their references.
async function fetchSingleAuthorWithRefCount(id) {
  const author = await Author.findByPk(id, {
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM \`AuthorsReferences\`
            WHERE \`authorId\` = Author.\`id\`
          )`),
          "refcount",
        ],
      ],
    },
    include: [AuthorAlias],
  }).catch((error) => {
    throw new Error(error);
  });

  return author?.clean();
}

// Fetch a single author with aliases and all references they're listed on.
async function fetchSingleAuthorComplex(id) {
  const author = await Author.findByPk(id, {
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM \`AuthorsReferences\`
            WHERE \`authorId\` = Author.\`id\`
          )`),
          "refcount",
        ],
      ],
    },
    include: [AuthorAlias, INCLUDE_REFERENCES],
  });

  return author?.clean();
}

// Fetch all authors along with aliases. Returns an object with the count in a
// property called "count" and all the authors in a property called "authors".
async function fetchAllAuthorsWithAliases(opts = {}) {
  const results = await Author.findAll({
    include: [AuthorAlias],
    ...opts,
  });

  const authors = results.map((author) => author.clean());

  return authors;
}

// Fetch all authors along with a count of how many references they're credited
// on. Returns the same shape of object as above.
async function fetchAllAuthorsWithRefCount(opts = {}) {
  if (opts.order) {
    // eslint-disable-next-line no-param-reassign
    opts.order = fixAggregateOrderFields(sequelize, opts.order, ["refcount"]);
  }

  const results = await Author.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM \`AuthorsReferences\`
            WHERE \`authorId\` = Author.\`id\`
          )`),
          "refcount",
        ],
      ],
    },
    include: [AuthorAlias],
    ...opts,
  });

  const authors = results.map((author) => author.clean());

  return authors;
}

// Fetch the author names and aliases, and create an alphabetized merged list
// that points any alias records to the actual name.
async function fetchAuthorsNamesAliasesList(opts = {}) {
  const results = await fetchAllAuthorsWithAliases(opts);
  const authors = [];

  for (const author of results) {
    const { id, name, aliases } = author;

    // Start with the author themselves:
    authors.push({ id, name });
    // Add any aliases for this author:
    for (const alias of aliases) {
      authors.push({ id, name: alias.name, aliasOf: name });
    }
  }
  authors.sort(sortByName);

  return authors;
}

// Create a new author using the content in data.
async function createAuthor(data) {
  const newId = await sequelize.transaction(async (txn) => {
    const author = await Author.create(
      { name: data.name },
      { transaction: txn }
    ).catch((error) => {
      if (error.hasOwnProperty("errors")) {
        const specific = error.errors[0];
        throw new Error(specific.message);
      } else {
        throw new Error(error.message);
      }
    });

    if (data.aliases.length) {
      const aliases = data.aliases
        .filter((item) => !item.deleted)
        .map((alias) => alias.name);

      for (const name of aliases) {
        // eslint-disable-next-line no-await-in-loop
        await author.createAuthorAlias({ name }, { transaction: txn });
      }
    }

    return author.id;
  });

  return fetchSingleAuthorSimple(newId);
}

// Update a single author using the content in data.
async function updateAuthor(id, data) {
  return Author.findByPk(id, { include: [AuthorAlias] })
    .then((author) => {
      return sequelize.transaction(async (txn) => {
        if (data.name !== author.name) {
          await author.update({ name: data.name }, { transaction: txn });
        }

        const aliases = {};
        const toDelete = [];
        const toAdd = [];
        const toUpdate = [];
        author.AuthorAliases.forEach((alias) => (aliases[alias.id] = alias));

        // Gather those that should be deleted. This will create an array of
        // objects due to using the table derived from author.
        data.aliases
          .filter((alias) => alias.id !== 0 && alias.deleted)
          .forEach((alias) => {
            if (aliases.hasOwnProperty(alias.id)) {
              toDelete.push(aliases[alias.id]);
            }
          });
        // Gather those that should be added. For this, we only need the name
        // field.
        data.aliases
          .filter((alias) => alias.id === 0 && alias.name.length !== 0)
          .forEach((alias) => toAdd.push(alias.name));
        // Gather the ones that need to be updated. Here we store the object
        // itself (as taken from the table).
        data.aliases
          .filter((alias) => alias.id !== 0 && !alias.deleted)
          .forEach((alias) => {
            if (aliases.hasOwnProperty(alias.id)) {
              if (aliases[alias.id].name !== alias.name) {
                const aliasToUpdate = aliases[alias.id];
                aliasToUpdate.name = alias.name;
                toUpdate.push(aliasToUpdate);
              }
            }
          });

        for (const alias of toDelete) {
          // eslint-disable-next-line no-await-in-loop
          await author.removeAuthorAlias(alias, { transaction: txn });
          // eslint-disable-next-line no-await-in-loop
          await alias.destroy({ transaction: txn });
        }
        for (const alias of toUpdate) {
          // eslint-disable-next-line no-await-in-loop
          await alias.save({ transaction: txn });
        }
        for (const name of toAdd) {
          // eslint-disable-next-line no-await-in-loop
          await author.createAuthorAlias({ name }, { transaction: txn });
        }
      });
    })
    .then(() => {
      return fetchSingleAuthorSimple(id);
    });
}

// Delete a single Author from the database.
async function deleteAuthor(id) {
  return Author.destroy({ where: { id } });
}

module.exports = {
  fetchSingleAuthorSimple,
  fetchSingleAuthorWithRefCount,
  fetchSingleAuthorComplex,
  fetchAllAuthorsWithAliases,
  fetchAllAuthorsWithRefCount,
  fetchAuthorsNamesAliasesList,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
