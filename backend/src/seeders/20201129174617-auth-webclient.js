require("dotenv").config({
  path: `.env.extra.${process.env.NODE_ENV}`,
});

const now = new Date();

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert("AuthClients", [
      {
        id: process.env.WEBCLIENT_ID,
        name: process.env.WEBCLIENT_NAME,
        secret: process.env.WEBCLIENT_SECRET,
        redirectUri: process.env.WEBCLIENT_REDIRECT_URI,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("AuthClients", null, {});
  },
};
