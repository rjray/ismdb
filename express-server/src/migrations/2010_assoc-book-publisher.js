/*
  Create the field for the belongsTo() association between Books and Publishers.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Books", "publisherId", {
    type: Sequelize.INTEGER,
    references: {
      model: "Publishers",
      key: "id",
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("Books", "publisherId");
}
