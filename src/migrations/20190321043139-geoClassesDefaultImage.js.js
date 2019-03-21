'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('GeoClasses', 'defaultImageUrl', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('GeoClasses', 'defaultImageUrl');
  },
};
