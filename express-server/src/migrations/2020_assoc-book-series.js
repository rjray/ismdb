/*
  Create the field for the belongsTo() association between Books and Series.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Books", "seriesId", {
    type: Sequelize.INTEGER,
    references: {
      model: "Series",
      key: "id",
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("Books", "seriesId");
}
