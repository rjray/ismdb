module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("OAuthScopes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING(256),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("OAuthScopes");
  },
};
