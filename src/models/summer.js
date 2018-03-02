'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const Summer = sequelizeClient.define('Summer', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    timing: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
    magnitude10: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
    magnitude50: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
    durationFlush: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
    durationWet: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
    noFlowCount: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
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
