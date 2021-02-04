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
    const mainId = createMain ? baseId++ : 0;
    const guestId = createGuest ? baseId++ : 0;
    const users = [
      {
        id: adminId,
        user: "admin",
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
    if (createMain) {
      users.push({
        id: mainId,
        user: process.env.MAINUSER_USER,
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
    if (createGuest) {
      users.push({
        id: guestId,
        user: "guest",
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

    return queryInterface.bulkInsert("UsersAuthScopes", linkages);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
