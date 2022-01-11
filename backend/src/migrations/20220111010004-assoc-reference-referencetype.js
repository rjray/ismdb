/*
  Create the field for the belongsTo() association between References and
  ReferenceTypes.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("References", "referenceTypeId", {
      type: Sequelize.INTEGER,
      references: {
        model: "ReferenceTypes",
        key: "id",
      },
      allowNull: false,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("References", "referenceTypeId");
  },
};
