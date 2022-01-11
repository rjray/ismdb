/*
  Seed the Users and UsersAuthScopes tables.
 */

const bcrypt = require("bcrypt");
require("dotenv").config({
  path: `.env.extra.${process.env.NODE_ENV}`,
});

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    const createGuest = process.env.CREATE_GUESTUSER;
    const createMain = process.env.CREATE_MAINUSER;
    let baseId = 1;
    const adminId = baseId++;
    const guestId = createGuest ? baseId++ : 0;
    const mainId = createMain ? baseId++ : 0;
    // Always have an admin user:
    const users = [
      {
        id: adminId,
        username: "admin",
        name: process.env.ADMINUSER_NAME,
        email: process.env.ADMINUSER_EMAIL,
        password: bcrypt.hashSync(process.env.ADMINUSER_PASSWORD, 10),
        resetRequired: false,
        verified: true,
        disabled: false,
        createdAt: now,
        updatedAt: now,
      },
    ];
    // Add a guest user if requested:
    if (createGuest) {
      users.push({
        id: guestId,
        username: "guest",
        name: "Guest User",
        email: process.env.GUESTUSER_EMAIL,
        password: bcrypt.hashSync(process.env.GUESTUSER_PASSWORD, 10),
        resetRequired: false,
        verified: true,
        disabled: false,
        createdAt: now,
        updatedAt: now,
      });
    }
    // Add a "main" user if requested:
    if (createMain) {
      users.push({
        id: mainId,
        username: process.env.MAINUSER_USER,
        name: process.env.MAINUSER_NAME,
        email: process.env.MAINUSER_EMAIL,
        password: bcrypt.hashSync(process.env.MAINUSER_PASSWORD, 10),
        resetRequired: false,
        verified: true,
        disabled: false,
        createdAt: now,
        updatedAt: now,
      });
    }

    await queryInterface.bulkInsert("Users", users);

    const { sequelize } = queryInterface;
    const scopes = await sequelize.query("SELECT id, name FROM AuthScopes", {
      type: sequelize.QueryTypes.SELECT,
    });
    const linkages = [];
    scopes.forEach((scope) => {
      switch (scope.name) {
        case "admin":
          // This one only goes to the admin account
          linkages.push({ userId: adminId, authScopeId: scope.id });
          break;
        case "guest":
          // This goes to just the guest account
          if (createGuest)
            linkages.push({ userId: guestId, authScopeId: scope.id });
          break;
        default:
          // These go to both admin and main account
          linkages.push({ userId: adminId, authScopeId: scope.id });
          if (createMain)
            linkages.push({ userId: mainId, authScopeId: scope.id });
          break;
      }
    });

    await queryInterface.bulkInsert("UsersAuthScopes", linkages);
  },

  down: async (queryInterface) => {
    // Clear the tables in the opposite order as above:
    await queryInterface.bulkDelete("UsersAuthScopes", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
