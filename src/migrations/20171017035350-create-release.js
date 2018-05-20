'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Releases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      version: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tasks: {
        type: Sequelize.ARRAY(Sequelize.TEXT), // eslint-disable-line
        allowNull: true,
      },
      date: {
        type: Sequelize.TEXT,
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
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('Releases');
  },
};
