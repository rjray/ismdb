module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("AuthorsReferences", {
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Authors",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      referenceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "References",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable("AuthorsReferences");
  },
};
