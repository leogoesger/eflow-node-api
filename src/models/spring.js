'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const Spring = sequelizeClient.define('Spring', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    timing: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // eslint-disable-line
      allowNull: true,
    },
    magnitude: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // eslint-disable-line
      allowNull: true,
    },
    rateOfChange: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // eslint-disable-line
      allowNull: true,
    },
    duration: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // eslint-disable-line
      allowNull: true,
    },
  });
  Spring.associate = models => {
    Spring.belongsTo(models.Gauge, {
      foreignKey: 'gaugeId',
      as: 'gauge',
    });
  };
  return Spring;
};
