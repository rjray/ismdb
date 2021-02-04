module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert("AuthScopes", [
      {
        name: "admin",
        description: "Administrative account",
      },
      {
        name: "write",
        description: "Permission to write content",
      },
      {
        name: "guest",
        description: "Account is a guest-only user",
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("AuthScopes", null, {});
  },
};
