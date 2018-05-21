'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const geoClass = sequelizeClient.define('GeoClass', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
  geoClass.associate = models => {
    geoClass.belongsTo(models.GeoRegion, {
      foreignKey: 'geoRegionId',
      as: 'geoRegions',
    });
    geoClass.belongsTo(models.Classification, {
      foreignKey: 'hydroClassId',
      as: 'hydroClasses',
    });
    geoClass.hasMany(models.GeoSite, {
      foreignKey: 'geoClassId',
      as: 'geoSites',
    });
  };
  return geoClass;
};
