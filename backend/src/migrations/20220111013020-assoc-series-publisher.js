/*
  Create the field for the belongsTo() association between Series and
  Publishers.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Series", "publisherId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Publishers",
        key: "id",
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("Series", "publisherId");
  },
};
