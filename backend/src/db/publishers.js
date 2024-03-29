/*
  All database operations that focus on publishers.
 */

const { Book, Publisher, Reference, Series, sequelize } = require("../models");
const { shallowIncludesForReference } = require("./references");

// "Clean" a Publisher object that has references data.
function cleanPublisherWithReferences(publisherIn) {
  const publisher = publisherIn.clean();

  publisher.references = publisher.books.map((book) => {
    const bookCopy = { ...book };
    const { reference } = bookCopy;
    delete bookCopy.reference;
    reference.book = bookCopy;

    return reference;
  });
  delete publisher.books;

  return publisher;
}

// Get a single series with Publisher but no references
const fetchSinglePublisherSimple = async (id) => {
  const publisher = await Publisher.findByPk(id, {
    include: [Series],
  });

  return publisher?.clean();
};

// Get a single Publisher with all Series and all related references. Note that
// this means some heavy post-processing of the data that the "Books" relation
// provides. See cleanPublisherWithReferences.
const fetchSinglePublisherComplete = async (id) => {
  const publisher = await Publisher.findByPk(id, {
    include: [
      Series,
      {
        model: Book,
        as: "Books",
        include: [{ model: Reference, include: shallowIncludesForReference }],
      },
    ],
  });

  if (!publisher) return null;

  return cleanPublisherWithReferences(publisher);
};

// Fetch all Publisher records with the Publisher information included. Return
// the data and the count of all matching Publisher.
const fetchAllPublishersSimpleWithCount = async (opts = {}) => {
  const count = await Publisher.count(opts);
  const results = await Publisher.findAll({ ...opts });

  const publishers = results.map((result) => result.clean());

  return { count, publishers };
};

// Fetch all Publisher records with the Series information included. Return
// the data and the count of all matching Publisher.
const fetchAllPublishersCompleteWithCount = async (opts = {}) => {
  const count = await Publisher.count(opts);
  const results = await Publisher.findAll({
    include: [
      Series,
      {
        model: Book,
        as: "Books",
        include: [{ model: Reference, include: shallowIncludesForReference }],
      },
    ],
    ...opts,
  });

  const publishers = results.map((result) =>
    cleanPublisherWithReferences(result)
  );

  return { count, publishers };
};

// Create a new publisher using the content in data.
const createPublisher = async (data) => {
  const publisher = await Publisher.create(data).catch((error) => {
    if (error.hasOwnProperty("errors")) {
      const specific = error.errors[0];
      throw new Error(specific.message);
    } else {
      throw new Error(error.message);
    }
  });

  return publisher.clean();
};

// Update a single publisher using the content in data.
const updatePublisher = async (id, data) => {
  return Publisher.findByPk(id).then((publisher) => {
    return sequelize.transaction(async (txn) => {
      const updatedPublisher = await publisher.update(data, {
        transaction: txn,
      });
      return updatedPublisher.clean();
    });
  });
};

// Delete a single Publisher record.
const deletePublisher = async (id) => {
  return Publisher.destroy({ where: { id } });
};

module.exports = {
  cleanPublisherWithReferences,
  fetchSinglePublisherSimple,
  fetchSinglePublisherComplete,
  fetchAllPublishersSimpleWithCount,
  fetchAllPublishersCompleteWithCount,
  createPublisher,
  updatePublisher,
  deletePublisher,
};
