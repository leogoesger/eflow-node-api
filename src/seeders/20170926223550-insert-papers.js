'use strict';
const {papers} = require('../seeder-data');

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert('Papers', papers);
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Papers');
  },
};
