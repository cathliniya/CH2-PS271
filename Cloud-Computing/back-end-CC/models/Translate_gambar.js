module.exports = (sequelize, DataTypes) => {
  const Translate_gambar = sequelize.define('Translate_gambar', {
    IDg: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    Deskripsi: {
      type: DataTypes.TEXT,
      references: {
        model: 'translate',
        key: 'id'
      },
    },
    url_gambar: {
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
    tableName: 'translate_gambar'
  });

  Translate_gambar.associate = models => {
    Translate_gambar.belongsTo(models.Translate, {
      foreignKey: {
        name: 'id',
        type: DataTypes.INTEGER,
      }
    });
  };

  return Translate_gambar;
};