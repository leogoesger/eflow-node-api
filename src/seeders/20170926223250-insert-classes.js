'use strict';
const {classifications} = require('../seeder-data');

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert('Classifications', classifications);
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Classifications');
  },
};
