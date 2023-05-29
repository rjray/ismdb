/*
  Create the field for the belongsTo() association between AuthorAliases and
  Authors.
 */

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("AuthorAliases", "authorId", {
    type: Sequelize.INTEGER,
    references: {
      model: "Authors",
      key: "id",
    },
    onDelete: "CASCADE",
    allowNull: false,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("AuthorAliases", "authorId");
}
