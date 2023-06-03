/*
  All database operations that focus on publishers.
 */

const { Reference, Book, Publisher, Series, sequelize } = require("../models");
const { includesForReference } = require("./references");

// Get a single publisher with all series but no references
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
        include: [{ model: Reference, include: includesForReference }],
      },
    ],
  });

  return publisher?.clean();
};

// Fetch all Publisher records with the Publisher information included. Return
// the data and the count of all matching Publisher records.
const fetchAllPublishersSimpleWithCount = async (opts = {}) => {
  const count = await Publisher.count(opts);
  const results = await Publisher.findAll({
    include: [Series],
    ...opts,
  });

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
        include: [{ model: Reference, include: includesForReference }],
      },
    ],
    ...opts,
  });

  const publishers = results.map((result) => result.clean());

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
  fetchSinglePublisherSimple,
  fetchSinglePublisherComplete,
  fetchAllPublishersSimpleWithCount,
  fetchAllPublishersCompleteWithCount,
  createPublisher,
  updatePublisher,
  deletePublisher,
};
