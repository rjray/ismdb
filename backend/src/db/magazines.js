/*
 * All database operations that focus on magazines.
 */

const _ = require("lodash")

const { Magazine, MagazineIssue, sequelize } = require("../models")

// Most-basic magazine request. Single magazine without issues or anything.
const fetchSingleMagazineSimple = async id => {
  let magazine = await Magazine.findByPk(id).catch(error => {
    throw new Error(error)
  })

  if (magazine) {
    magazine = magazine.get()
  } else {
    throw new Error(`No magazine with id "${id}" found`)
  }

  return magazine
}

module.exports = { fetchSingleMagazineSimple }
