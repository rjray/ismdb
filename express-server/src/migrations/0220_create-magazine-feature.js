/*
  Database set-up/tear-down for MagazineFeatures table.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("MagazineFeatures", {
    referenceId: {
      allowNull: false,
      primaryKey: true,
      references: {
        model: "References",
        key: "id",
      },
      onDelete: "CASCADE",
      type: Sequelize.INTEGER,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("MagazineFeatures");
}
