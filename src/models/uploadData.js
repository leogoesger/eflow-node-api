'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const UploadData = sequelizeClient.define('UploadData', {
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
    startDate: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    yearRanges: {
      type: DataTypes.JSONB, // eslint-disable-line
      // allowNull: false,
    },
    flowMatrix: {
      type: DataTypes.JSONB, // eslint-disable-line
      // allowNull: false,
    },
    DRH: {
      type: DataTypes.JSONB, // eslint-disable-line
      // allowNull: false,
    },
    allYear: {
      type: DataTypes.JSONB, // eslint-disable-line
      // allowNull: false,
    },
    winter: {
      type: DataTypes.JSONB, // eslint-disable-line
      // allowNull: false,
    },
    fall: {
      type: DataTypes.JSONB, // eslint-disable-line
      // allowNull: false,
    },
    summer: {
      type: DataTypes.JSONB, // eslint-disable-line
      // allowNull: false,
    },
    spring: {
      type: DataTypes.JSONB, // eslint-disable-line
      // allowNull: false,
    },
    fallWinter: {
      type: DataTypes.JSONB, // eslint-disable-line
      // allowNull: false,
    },
    dates: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // eslint-disable-line
      // allowNull: false,
    },
    flows: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // eslint-disable-line
      // allowNull: false,
    },
    failed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  UploadData.associate = models => {
    UploadData.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    UploadData.hasMany(models.Prediction, {
      foreignKey: 'uploadDataId',
      as: 'predictions',
    });
  };
  return UploadData;
};
