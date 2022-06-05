/*
  All database operations that focus on series.
 */

const {
  Author,
  Book,
  Publisher,
  Reference,
  ReferenceType,
  Series,
  Tag,
} = require("../models");

const includesForReference = [
  ReferenceType,
  { model: Author, as: "Authors" },
  { model: Tag, as: "Tags" },
];

// "Clean" a Series object that has references data.
function cleanSeriesWithReferences(seriesIn) {
  const series = seriesIn.clean();

  const publisherCopy = series.publisher ? { ...series.publisher } : null;
  const seriesCopy = {
    id: series.id,
    name: series.name,
    notes: series.notes,
    publisher: publisherCopy || undefined,
  };

  series.references = series.books.map((book) => {
    const bookCopy = { ...book };
    const { reference } = bookCopy;
    delete bookCopy.reference;
    bookCopy.series = seriesCopy;
    if (publisherCopy) bookCopy.publisher = publisherCopy;
    reference.book = bookCopy;

    return reference;
  });
  delete series.books;

  return series;
}

// Get a single series with Publisher but no references
const fetchSingleSeriesSimple = async (id) => {
  const series = await Series.findByPk(id, {
    include: [Publisher],
  });

  return series?.clean();
};

// Get a single series with Publisher and all related references. Note that
// this means some heavy post-processing of the data that the "Books" relation
// provides. See cleanSeriesWithReferences.
const fetchSingleSeriesComplete = async (id) => {
  const series = await Series.findByPk(id, {
    include: [
      Publisher,
      {
        model: Book,
        as: "Books",
        include: [{ model: Reference, include: includesForReference }],
      },
    ],
  });

  if (!series) return null;

  return cleanSeriesWithReferences(series);
};

// Fetch all Series records with the Publisher information included. Return
// the data and the count of all matching Series.
const fetchAllSeriesSimpleWithCount = async (opts = {}) => {
  const count = await Series.count(opts);
  const results = await Series.findAll({
    include: [Publisher],
    ...opts,
  });

  const series = results.map((result) => result.clean());

  return { count, series };
};

// Fetch all Series records with the Publisher information included. Return
// the data and the count of all matching Series.
const fetchAllSeriesCompleteWithCount = async (opts = {}) => {
  const count = await Series.count(opts);
  const results = await Series.findAll({
    include: [
      Publisher,
      {
        model: Book,
        as: "Books",
        include: [{ model: Reference, include: includesForReference }],
      },
    ],
    ...opts,
  });

  const series = results.map((result) => cleanSeriesWithReferences(result));

  return { count, series };
};

module.exports = {
  fetchSingleSeriesSimple,
  fetchSingleSeriesComplete,
  fetchAllSeriesSimpleWithCount,
  fetchAllSeriesCompleteWithCount,
};
