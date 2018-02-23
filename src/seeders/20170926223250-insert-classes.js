'use strict';
const {classes} = require('../seeder-data');

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert('Classes', classes);
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Classes');
  },
};
