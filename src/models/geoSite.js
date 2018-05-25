'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const geoSite = sequelizeClient.define('GeoSite', {
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
    identity: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    geometry: {
      type: DataTypes.JSONB, // eslint-disable-line
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
  geoSite.associate = models => {
    geoSite.belongsTo(models.GeoClass, {
      foreignKey: 'geoClassId',
      as: 'geoClass',
    });
  };
  return geoSite;
};
