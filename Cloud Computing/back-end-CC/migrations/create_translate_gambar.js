'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('translate_gambar', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TranslateId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'translate',
          key: 'id'
        }
      },
      gambar: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('translate_gambar');
  }
};
