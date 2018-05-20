'use strict';
const {releases} = require('../seeder-data');

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert('Releases', releases);
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Releases');
  },
};
