'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const Winter = sequelizeClient.define('Winter', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    timing2: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    timing5: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    timing10: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    timing20: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    timing50: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    duration2: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    duration5: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    duration10: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    duration20: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    duration50: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    frequency2: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    frequency5: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    frequency10: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    frequency20: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    frequency50: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
  });
  Winter.associate = models => {
    Winter.belongsTo(models.Gauge, {
      foreignKey: 'gaugeId',
      as: 'gauge',
    });
  };
  return Winter;
};
