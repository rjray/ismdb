/*
  Create the field for the belongsTo() association between References and
  ReferenceTypes.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("References", "referenceTypeId", {
    type: Sequelize.INTEGER,
    references: {
      model: "ReferenceTypes",
      key: "id",
    },
    allowNull: false,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("References", "referenceTypeId");
}
