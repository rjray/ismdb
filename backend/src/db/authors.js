/*
 * All database operations that focus on authors.
 */

const { Author, AuthorAlias, sequelize } = require("../models");
const { sortBy, fixAggregateOrderFields } = require("../lib/utils");
const { INCLUDE_REFERENCES, cleanReference } = require("./references");

const sortByName = sortBy("name");

function convertAliases(aliasList) {
  const aliases = aliasList.map((item) => {
    item = item.get();
    delete item.AuthorId;
    return item;
  });
  aliases.sort(sortByName);

  return aliases;
}

// Most-basic author request. Single author with any aliases.
const fetchSingleAuthorSimple = async (id) => {
  let author = await Author.findByPk(id, { include: [AuthorAlias] }).catch(
    (error) => {
      throw new Error(error);
    }
  );

  if (author) {
    author = author.get();
    author.aliases = convertAliases(author.AuthorAliases);
    delete author.AuthorAliases;
  }

  return author;
};

// Single author with any aliases and a count of their references.
const fetchSingleAuthorWithRefCount = async (id) => {
  let author = await Author.findByPk(id, {
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

  if (author) {
    author = author.get();
    author.aliases = convertAliases(author.AuthorAliases);
    delete author.AuthorAliases;
  }

  return author;
};

// Fetch a single author with aliases and all references they're listed on.
const fetchSingleAuthorComplex = async (id) => {
  let author = await Author.findByPk(id, {
    include: [AuthorAlias, INCLUDE_REFERENCES],
  });

  if (author) {
    author = author.get();
    author.aliases = convertAliases(author.AuthorAliases);
    delete author.AuthorAliases;

    author.references = author.References.map((reference) =>
      cleanReference(reference)
    );
    delete author.References;
  }

  return author;
};

// Fetch all authors along with aliases. Returns an object with the count in a
// property called "count" and all the authors in a property called "authors".
const fetchAllAuthorsWithAliasesAndCount = async (opts = {}) => {
  const count = await Author.count(opts);
  const results = await Author.findAll({
    include: [AuthorAlias],
    ...opts,
  });

  const authors = results.map((author) => {
    author = author.get();
    author.aliases = convertAliases(author.AuthorAliases);
    delete author.AuthorAliases;

    return author;
  });

  return { count, authors };
};

// Fetch all authors along with a count of how many references they're credited
// on. Returns the same shape of object as above.
const fetchAllAuthorsWithRefCountAndCount = async (opts = {}) => {
  const optsNoOrder = { ...opts };
  if (opts.order) {
    delete optsNoOrder.order;
    opts.order = fixAggregateOrderFields(sequelize, opts.order, ["refcount"]);
  }

  const count = await Author.count(optsNoOrder);
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

  const authors = results.map((author) => {
    author = author.get();
    author.aliases = convertAliases(author.AuthorAliases);
    delete author.AuthorAliases;

    return author;
  });

  return { count, authors };
};

// Fetch the author names and aliases, and create an alphabetized merged list
// that points any alias records to the actual name.
const fetchAuthorsNamesAliasesList = async (opts = {}) => {
  const results = await fetchAllAuthorsWithAliasesAndCount(opts);
  const authors = [];

  for (const author of results.authors) {
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
};

// Create a new author using the content in data.
const createAuthor = async (data) => {
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
      let aliases = data.aliases
        .filter((item) => !item.deleted)
        .map((alias) => alias.name);

      for (let name of aliases) {
        await author.createAuthorAlias({ name: name }, { transaction: txn });
      }
    }

    return author.id;
  });

  return fetchSingleAuthorSimple(newId);
};

// Update a single author using the content in data.
const updateAuthor = async (id, data) => {
  return Author.findByPk(id, { include: [AuthorAlias] })
    .then((author) => {
      return sequelize.transaction(async (txn) => {
        if (data.name !== author.name) {
          await author.update({ name: data.name }, { transaction: txn });
        }

        let aliases = {},
          toDelete = [],
          toAdd = [],
          toUpdate = [];
        author.AuthorAliases.forEach((alias) => (aliases[alias.id] = alias));

        // Gather those that should be deleted. This will create an array of
        // objects due to using the table derived from author.
        data.aliases
          .filter((alias) => alias.id != 0 && alias.deleted)
          .forEach((alias) => {
            if (aliases.hasOwnProperty(alias.id)) {
              toDelete.push(aliases[alias.id]);
            }
          });
        // Gather those that should be added. For this, we only need the name
        // field.
        data.aliases
          .filter((alias) => alias.id == 0 && alias.name.length != 0)
          .forEach((alias) => toAdd.push(alias.name));
        // Gather the ones that need to be updated. Here we store the object
        // itself (as taken from the table).
        data.aliases
          .filter((alias) => alias.id != 0 && !alias.deleted)
          .forEach((alias) => {
            if (aliases.hasOwnProperty(alias.id)) {
              if (aliases[alias.id].name != alias.name) {
                let aliasToUpdate = aliases[alias.id];
                aliasToUpdate.name = alias.name;
                toUpdate.push(aliasToUpdate);
              }
            }
          });

        for (let alias of toDelete) {
          await author.removeAuthorAlias(alias, { transaction: txn });
          await alias.destroy({ transaction: txn });
        }
        for (let alias of toUpdate) {
          await alias.save({ transaction: txn });
        }
        for (let name of toAdd) {
          await author.createAuthorAlias({ name: name }, { transaction: txn });
        }
      });
    })
    .then(() => {
      return fetchSingleAuthorSimple(id);
    });
};

// Delete a single Author from the database.
const deleteAuthor = async (id) => {
  return Author.destroy({ where: { id } });
};

module.exports = {
  fetchSingleAuthorSimple,
  fetchSingleAuthorWithRefCount,
  fetchSingleAuthorComplex,
  fetchAllAuthorsWithAliasesAndCount,
  fetchAllAuthorsWithRefCountAndCount,
  fetchAuthorsNamesAliasesList,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
