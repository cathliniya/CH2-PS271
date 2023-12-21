// Added new field gambar_isyarat to translate model and added new functionality to add, update and delete gambar_isyarat
'use strict';

var bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash('admin', salt);

    await queryInterface.bulkInsert('user', [{
      nama: 'Administrator',
      username: 'admin',
      password: hashPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user');
  }
};
