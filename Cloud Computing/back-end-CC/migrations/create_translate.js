'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('translate', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_huruf: {
        allowNull: false,
        type: Sequelize.VARCHAR
      },
      deskripsi: {
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
    await queryInterface.dropTable('translate');
  }
};