'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const Release = sequelizeClient.define('Release', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    version: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tasks: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // eslint-disable-line
      allowNull: true,
    },
  });

  return Release;
};
