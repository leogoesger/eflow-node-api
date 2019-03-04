'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Adds location column to UploadData table
    */
    return queryInterface
      .addColumn('UploadData', 'location', {
        type: Sequelize.TEXT,
        allowNull: true,
      })
      .then(() =>
        queryInterface.addColumn('UploadData', 'riverName', {
          type: Sequelize.TEXT,
          allowNull: true,
        })
      );
  },

  down: queryInterface => {
    /*
      Removes location column to UploadData table
    */

    return queryInterface
      .removeColumn('UploadData', 'location')
      .then(() => queryInterface.removeColumn('UploadData', 'riverName'));
  },
};
