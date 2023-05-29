/*
  Seed the AuthScopes table with the set of values that will be used.
 */

export async function up(queryInterface) {
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
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("AuthScopes", null, {});
}
