'use strict';

module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
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
  });
  Class.associate = models => {
    Class.hasMany(models.Gauge, {
      foreignKey: 'classId',
      as: 'gauges',
    });
    Class.hasMany(models.GeoClass, {
      foreignKey: 'classId',
      as: 'geoclasses',
    });
  };
  return Class;
};
