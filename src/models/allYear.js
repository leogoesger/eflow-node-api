'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const allYear = sequelizeClient.define('AllYear', {
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
    average: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    standardDeviation: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    coeffientVariance: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
  });
  allYear.associate = models => {
    allYear.belongsTo(models.Gauge, {
      foreignKey: 'gaugeId',
      as: 'gauge',
    });
  };
  return allYear;
};
