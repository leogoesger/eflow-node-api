'use strict';

module.exports = (sequelize, DataTypes) => {
  const GeoClass = sequelize.define('GeoClass', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    geometry: {
      type: DataTypes.JSONB, // eslint-disable-line
      allowNull: true,
    },
    zoom: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  GeoClass.associate = models => {
    GeoClass.belongsTo(models.Class, {
      foreignKey: 'classId',
      as: 'classes',
    });
  };
  return GeoClass;
};
