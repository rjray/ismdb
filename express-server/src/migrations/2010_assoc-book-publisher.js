/*
  Create the field for the belongsTo() association between Books and Publishers.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Books", "publisherId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Publishers",
        key: "id",
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("Books", "publisherId");
  },
};
