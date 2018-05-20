'use strict';
const {geoSites} = require('../seeder-data');

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert('GeoSites', geoSites);
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('GeoSites');
  },
};
