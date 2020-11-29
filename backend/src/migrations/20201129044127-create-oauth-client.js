module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("OAuthClients", {
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
      secret: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      redirectUri: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("OAuthClients");
  },
};
