'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      role: {
        type: Sequelize.ENUM,
        values: ['USER', 'ADMIN'],
        defaultValue: 'USER',
      },
      firstName: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      middleName: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: '',
      },
      lastName: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      address1: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: '',
      },
      address2: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: '',
      },
      city: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: '',
      },
      zip: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: '',
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
    return queryInterface.dropTable('Users');
  },
};
