'use strict';
const {members} = require('../seeder-data');

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert('Members', members);
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Members');
  },
};
