module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    ID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: {
      allowNull: false,
      type: DataTypes.VARCHAR
    },
    username: {
      allowNull: false,
      type: DataTypes.VARCHAR,
      unique: true
    },
    password: {
      allowNull: false,
      type: DataTypes.VARCHAR
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'user'
  });

  return User;
};