'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      location: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      website: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      linkedin: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      twitter: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      github: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      youtube: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      googleScholar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      researchGate: {
        type: Sequelize.TEXT,
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
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('Members');
  },
};
