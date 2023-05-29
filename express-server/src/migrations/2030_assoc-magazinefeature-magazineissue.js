/*
  Create the field for the belongsTo() association between MagazineFeatures and
  MagazineIssues.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("MagazineFeatures", "magazineIssueId", {
    type: Sequelize.INTEGER,
    references: {
      model: "MagazineIssues",
      key: "id",
    },
    onDelete: "CASCADE",
    allowNull: false,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("MagazineFeatures", "magazineIssueId");
}
