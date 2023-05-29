/*
  Create the field for the belongsTo() association between AuthorAliases and
  Authors.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("AuthorAliases", "authorId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Authors",
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("AuthorAliases", "authorId");
  },
};
