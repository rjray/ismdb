/*
  Create the field for the belongsTo() association between MagazineIssues and
  Magazines.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("MagazineIssues", "magazineId", {
    type: Sequelize.INTEGER,
    references: {
      model: "Magazines",
      key: "id",
    },
    onDelete: "CASCADE",
    allowNull: false,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("MagazineIssues", "magazineId");
}
