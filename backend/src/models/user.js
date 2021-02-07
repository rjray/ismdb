module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(75),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      resetRequired: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      disabledReason: DataTypes.STRING(255),
      failedLoginAttempts: {
        type: DataTypes.SMALLINT,
        default: 0,
      },
    },
    {}
  );
  User.associate = function (models) {
    User.belongsToMany(models.AuthScope, {
      as: "Scopes",
      through: { model: models.UsersAuthScopes },
      foreignKey: "userId",
    });
  };

  return User;
};
