module.exports = (sequelize, DataTypes) => {
  const Translate= sequelize.define('Translate', {
    IDt: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_ID: {
      allowNull: false,
      type: DataTypes.INTERGER
    },
    gambar_ID: {
      allowNull: false,
      type: DataTypes.INTERGER
    },
    isyarat: {
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
    tableName: 'translate'
  });

  Translate.associate = models => {
    Translate.hasMany(models.Translate_gambar, {
      foreignKey: 'gambar_ID'
    });
    Translate.belongsToMany(models.User, {
      foreignKey: 'user_ID'
    });
  };

  return Translate;
};