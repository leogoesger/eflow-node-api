'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FallWinters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      magWet: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL(10, 2)), // eslint-disable-line
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
    return queryInterface.dropTable('FallWinters');
  },
};
