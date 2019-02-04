'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const Prediction = sequelizeClient.define('Prediction', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    prediction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    one: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
    two: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
    three: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
    four: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
    five: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
    six: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
    seven: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
    eight: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
    nine: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
  });
  Prediction.associate = models => {
    Prediction.belongsTo(models.UploadData, {
      foreignKey: 'uploadDataId',
      as: 'uploadData',
    });
  };
  return Prediction;
};
