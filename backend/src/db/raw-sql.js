/*
 * All database operations that require raw SQL.
 */

const { sequelize } = require("../models")

// Query for all the distinct values in references' "language" field. Force
// "English" to the top of the list.
const fetchLanguages = async () => {
  const langQuery = `
    SELECT DISTINCT(language) FROM \`References\` WHERE
    language IS NOT NULL AND language != "" AND language != "English"
    ORDER BY language
  `
  const queryOptions = {
    type: sequelize.QueryTypes.SELECT,
  }

  let languages = await sequelize.query(langQuery, queryOptions)
  languages = languages.map(l => l.language)
  languages.unshift("English")

  return languages
}

module.exports = { fetchLanguages }
