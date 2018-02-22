'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const Fall = sequelizeClient.define('Fall', {
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
    timing: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    magnitude: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    timingWet: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    duration: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
  });
  Fall.associate = models => {
    Fall.belongsTo(models.Gauge, {
      foreignKey: 'gaugeId',
      as: 'gauge',
    });
  };
  return Fall;
};
