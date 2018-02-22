'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const Summer = sequelizeClient.define('Summer', {
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
    magnitude10: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    magnitude50: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    durationFlush: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    durationWet: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    noFlowCount: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
  });
  Summer.associate = models => {
    Summer.belongsTo(models.Gauge, {
      foreignKey: 'gaugeId',
      as: 'gauge',
    });
  };
  return Summer;
};
