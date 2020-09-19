/*
 * All database operations that focus on tags.
 */

const {
  Author,
  Magazine,
  MagazineIssue,
  RecordType,
  Reference,
  Tag,
  sequelize,
} = require("../models");

// Basic tag request: just the requested tag.
const fetchSingleTagSimple = async (id) => {
  const tag = await Tag.findByPk(id).catch((error) => {
    throw new Error(error);
  });

  return tag ? tag.get() : tag;
};

// Fetch a specific tag with the count of associated references as "refcount".
const fetchSingleTagWithRefCount = async (id) => {
  const result = await Tag.findByPk(id, {
    include: [
      {
        model: Reference,
        as: "References",
        attributes: ["id"],
      },
    ],
  }).catch((error) => {
    throw new Error(error);
  });

  if (result) {
    const tag = result.get();
    const refcount = tag.References.length;
    delete tag.References;
    return { tag, refcount };
  } else {
    return tag;
  }
};

// Fetch a specific tag with all the tagged references.
const fetchSingleTagWithReferences = async (id) => {
  const result = await Tag.findByPk(id, {
    include: [
      {
        model: Reference,
        as: "References",
        include: [
          RecordType,
          { model: MagazineIssue, include: [Magazine] },
          { model: Author, as: "Authors" },
          { model: Tag, as: "Tags" },
        ],
      },
    ],
  }).catch((error) => {
    throw new Error(error);
  });

  if (result) {
    const tag = result.get();
    tag.references = tag.References.map((reference) => {
      reference = reference.get();

      reference.authors = reference.Authors.sort(
        (a, b) => a.AuthorsReferences.order - b.AuthorsReferences.order
      ).map((author) => {
        author = author.get();
        author.order = author.AuthorsReferences.order;
        delete author.AuthorsReferences;
        return author;
      });
      delete reference.Authors;

      reference.tags = reference.Tags.map((tag) => {
        tag = tag.get();
        delete tag.TagsReferences;
        return tag;
      });
      delete reference.Tags;
      delete reference.TagsReferences;

      if (reference.MagazineIssue) {
        reference.Magazine = reference.MagazineIssue.Magazine.get();
        reference.MagazineIssue = reference.MagazineIssue.get();
        delete reference.MagazineIssue.Magazine;
      }

      return reference;
    });
    delete tag.References;

    return tag;
  } else {
    return result;
  }
};

// Fetch all tags as an array, returning an object with the results and the
// count of the results (independent of any pagination options in opts).
const fetchAllTagsWithCount = async (opts = {}) => {
  const count = await Tag.count(opts);
  const results = await Tag.findAll({
    order: ["name"],
    ...opts,
  }).catch((error) => {
    throw new Error(error);
  });

  const tags = results.map((tag) => tag.get());

  return { count, tags };
};

// Fetch all tags as an array, returning an object with the results and the
// count of the results (independent of any pagination options in opts). Each
// tag object includes the count of associated references as "refcount".
const fetchAllTagsWithRefCountAndCount = async (opts = {}) => {
  const count = await Tag.count(opts);
  const results = await Tag.findAll({
    order: ["name"],
    include: [
      {
        model: Reference,
        as: "References",
        attributes: ["id"],
      },
    ],
    ...opts,
  }).catch((error) => {
    throw new Error(error);
  });

  const tags = results.map((tag) => {
    tag = tag.get();
    tag.refcount = tag.References.length;
    delete tag.References;

    return tag;
  });

  return { count, tags };
};

// Create a new tag using the content in data.
const createTag = async (data) => {
  const tag = await Tag.create(data).catch((error) => {
    if (error.hasOwnProperty("errors")) {
      const specific = error.errors[0];
      throw new Error(specific.message);
    } else {
      throw new Error(error);
    }
  });

  return tag.get();
};

// Update a single tag using the content in data.
const updateTag = async (id, data) => {
  return Tag.findByPk(id).then((tag) => {
    return sequelize.transaction(async (txn) => {
      tag = await tag.update(data, { transaction: txn });
      return tag;
    });
  });
};

// Delete a single tag from the database.
const deleteTag = async (id) => {
  return Tag.destroy({ where: { id } });
};

module.exports = {
  fetchSingleTagSimple,
  fetchSingleTagWithRefCount,
  fetchSingleTagWithReferences,
  fetchAllTagsWithCount,
  fetchAllTagsWithRefCountAndCount,
  createTag,
  updateTag,
  deleteTag,
};
