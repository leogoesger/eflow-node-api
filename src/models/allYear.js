'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const allYear = sequelizeClient.define('AllYear', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    average: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // eslint-disable-line
      allowNull: true,
    },
    standardDeviation: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // eslint-disable-line
      allowNull: true,
    },
    coeffientVariance: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // eslint-disable-line
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
