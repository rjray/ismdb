const bcrypt = require("bcrypt");
require("dotenv").config({
  path: `.env.extra.${process.env.NODE_ENV}`,
});

const now = new Date();

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Users", [
      {
        id: process.env.ADMINUSER_ID,
        name: process.env.ADMINUSER_NAME,
        email: process.env.ADMINUSER_EMAIL,
        password: bcrypt.hashSync(process.env.ADMINUSER_PASSWORD, 10),
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const { sequelize } = queryInterface;
    const scopes = await sequelize.query("SELECT id FROM AuthScopes", {
      type: sequelize.QueryTypes.SELECT,
    });
    const linkage = scopes.map((scope) => ({
      userId: process.env.ADMINUSER_ID,
      authScopeId: scope.id,
    }));

    return queryInterface.bulkInsert("UsersAuthScopes", linkage);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
