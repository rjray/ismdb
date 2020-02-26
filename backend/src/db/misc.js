/*
 * Miscellaneous queries that don't fit a single theme.
 */

const { RecordType } = require("../models")

// Fetch all RecordType entities.
const fetchAllRecordTypes = async (opts = {}) => {
  return RecordType.findAll({ ...opts })
}

module.exports = { fetchAllRecordTypes }
