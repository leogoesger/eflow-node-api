'use strict';

module.exports = (sequelize, DataTypes) => {
  const Gauge = sequelize.define('Gauge', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    stationName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    gps: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    unimpairedStartYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    unimpairedEndYear: {
      type: DataTypes.INTEGER,
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
    Gauge.hasMany(models.Year, {
      foreignKey: 'gaugeId',
      as: 'year',
    });
  };
  return Gauge;
};
