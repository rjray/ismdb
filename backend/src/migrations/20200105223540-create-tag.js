module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Tags", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(75),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING(255),
      },
      type: {
        type: Sequelize.STRING(25),
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable("Tags");
  },
};
