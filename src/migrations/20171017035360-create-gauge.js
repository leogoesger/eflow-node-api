'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Gauges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      stationName: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      geometry: {
        type: Sequelize.JSONB, // eslint-disable-line
        allowNull: true,
      },
      unimpairedStartYear: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      unimpairedEndYear: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      classId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Classifications',
          key: 'id',
        },
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('Gauges');
  },
};
