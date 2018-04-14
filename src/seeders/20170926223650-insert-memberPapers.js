'use strict';
const {memberPapers} = require('../seeder-data');

module.exports = {
  up: (queryInterface, _Sequelize) => {
    console.log('hello');
    return queryInterface.bulkInsert('MemberPapers', memberPapers);
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('MemberPapers');
  },
};
