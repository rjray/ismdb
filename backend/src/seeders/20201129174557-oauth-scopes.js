module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert("OAuthScopes", [
      {
        name: "admin",
        description: "Administrative access",
      },
      {
        name: "read",
        description: "Permission to read database content",
      },
      {
        name: "write",
        description: "Permission to write database content",
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("OAuthScopes", null, {});
  },
};
