'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Winters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      timing2: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      timing5: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      timing10: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      timing20: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      timing50: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      duration2: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      duration5: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      duration10: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      duration20: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      duration50: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      frequency2: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      frequency5: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      frequency10: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      frequency20: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      frequency50: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
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
    return queryInterface.dropTable('Winters');
  },
};
