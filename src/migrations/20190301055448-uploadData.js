'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Adds location column to UploadData table
    */
    return queryInterface.addColumn('UploadData', 'location', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Removes location column to UploadData table
    */
    return queryInterface.addColumn('UploadData', 'location', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
