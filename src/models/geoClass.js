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
  });
  GeoClass.associate = models => {
    GeoClass.belongsTo(models.Class, {
      foreignKey: 'classId',
      as: 'classes',
    });
  };
  return GeoClass;
};
