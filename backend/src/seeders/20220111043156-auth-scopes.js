/*
  Seed the AuthScopes table with the set of values that will be used.
 */

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("AuthScopes", [
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
    await queryInterface.bulkDelete("AuthScopes", null, {});
  },
};
