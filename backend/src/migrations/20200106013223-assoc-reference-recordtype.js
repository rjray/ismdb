module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("References", "recordTypeId", {
      type: Sequelize.INTEGER,
      references: {
        model: "RecordTypes",
        key: "id",
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("References", "recordTypeId");
  },
};
