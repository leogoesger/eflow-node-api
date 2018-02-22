'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Falls', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      timing: {
        type: Sequelize.ARRAY(Sequelize.TEXT), // eslint-disable-line
        allowNull: true,
      },
      magnitude: {
        type: Sequelize.ARRAY(Sequelize.TEXT), // eslint-disable-line
        allowNull: true,
      },
      timingWet: {
        type: Sequelize.ARRAY(Sequelize.TEXT), // eslint-disable-line
        allowNull: true,
      },
      duration: {
        type: Sequelize.ARRAY(Sequelize.TEXT), // eslint-disable-line
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      gaugeId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Gauges',
          key: 'id',
        },
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('Falls');
  },
};
