/*
  Create the field for the belongsTo() association between Series and
  Publishers.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Series", "publisherId", {
    type: Sequelize.INTEGER,
    references: {
      model: "Publishers",
      key: "id",
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("Series", "publisherId");
}
