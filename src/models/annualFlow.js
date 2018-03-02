'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const AnnualFlow = sequelizeClient.define('AnnualFlow', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    flowData: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
  });
  AnnualFlow.associate = models => {
    AnnualFlow.belongsTo(models.Gauge, {
      foreignKey: 'gaugeId',
      as: 'gauge',
    });
  };
  return AnnualFlow;
};
