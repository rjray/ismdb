module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("TagsReferences", {
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Tags",
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
    return queryInterface.dropTable("TagsReferences");
  },
};
