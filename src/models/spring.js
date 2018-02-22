'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const Spring = sequelizeClient.define('Spring', {
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
    rateOfChange: {
      type: DataTypes.ARRAY,
      allowNull: true,
    },
    duration: {
      type: DataTypes.ARRAY,
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
