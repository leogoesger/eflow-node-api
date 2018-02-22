'use strict';

module.exports = (sequelize, DataTypes) => {
  const Gauge = sequelize.define('Gauge', {
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
    gps: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });
  Gauge.associate = models => {
    Gauge.belongsTo(models.Class, {
      foreignKey: 'classId',
      as: 'class',
    });
    Gauge.hasMany(models.AllYear, {
      foreignKey: 'gaugeId',
      as: 'allYears',
    });
    Gauge.hasMany(models.Fall, {
      foreignKey: 'gaugeId',
      as: 'fall',
    });
    Gauge.hasMany(models.Spring, {
      foreignKey: 'gaugeId',
      as: 'spring',
    });
    Gauge.hasMany(models.Summer, {
      foreignKey: 'gaugeId',
      as: 'summer',
    });
    Gauge.hasMany(models.Winter, {
      foreignKey: 'gaugeId',
      as: 'winter',
    });
  };
  return Gauge;
};
