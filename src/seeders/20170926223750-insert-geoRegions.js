'use strict';
const {geoRegions} = require('../seeder-data');

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert('GeoRegions', geoRegions);
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('GeoRegions');
  },
};
