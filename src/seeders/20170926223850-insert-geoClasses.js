'use strict';
const {geoClasses} = require('../seeder-data');

module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert('GeoClasses', geoClasses);
  },
  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('GeoClasses');
  },
};
