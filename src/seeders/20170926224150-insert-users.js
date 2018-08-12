'use strict';
const {users} = require('../seeder-data');

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert('Users', users);
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Users');
  },
};
