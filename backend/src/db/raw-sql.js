"use strict";

/*
 * All database operations that require (mostly) raw SQL.
 */

const { sequelize } = require("../models");

// Get the N magazines that have been most-recently added to. If N is 0, will
// get all. Returns in descending order of date the most-recent-added issue
// was created.
const getMostRecentMagazines = async (n = 0) => {
  let query = `
    SELECT
      m.\`id\`, m.\`name\`, m.\`language\`, m.\`aliases\`, m.\`notes\`,
      m.\`createdAt\`, m.\`updatedAt\`, x.\`latest\`
    FROM
      \`Magazines\` AS \`m\`
        LEFT OUTER JOIN
      (
        SELECT
          \`magazineId\`, MAX(\`createdAt\`) AS \`latest\`
        FROM
          \`MagazineIssues\`
        GROUP BY \`magazineId\`
      ) AS \`x\` ON x.\`magazineId\` = m.\`id\`
    ORDER BY x.\`latest\` DESC
  `;
  if (n) query += `LIMIT ${n}`;

  const queryOptions = {
    type: sequelize.QueryTypes.SELECT,
  };
  const magazines = await sequelize.query(query, queryOptions);

  return magazines;
};

module.exports = { getMostRecentMagazines };
