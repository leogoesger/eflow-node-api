'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UploadData', {
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
      startDate: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      flowMatrix: {
        type: Sequelize.JSONB, // eslint-disable-line
        allowNull: false,
      },
      yearRanges: {
        type: Sequelize.JSONB, // eslint-disable-line
        allowNull: false,
      },
      DRH: {
        type: Sequelize.JSONB, // eslint-disable-line
        allowNull: false,
      },
      allYear: {
        type: Sequelize.JSONB, // eslint-disable-line
        allowNull: false,
      },
      winter: {
        type: Sequelize.JSONB, // eslint-disable-line
        allowNull: false,
      },
      fall: {
        type: Sequelize.JSONB, // eslint-disable-line
        allowNull: false,
      },
      summer: {
        type: Sequelize.JSONB, // eslint-disable-line
        allowNull: false,
      },
      spring: {
        type: Sequelize.JSONB, // eslint-disable-line
        allowNull: false,
      },
      fallWinter: {
        type: Sequelize.JSONB, // eslint-disable-line
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('UploadData');
  },
};
