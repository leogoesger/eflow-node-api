'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const FailedUpload = sequelizeClient.define('FailedUpload', {
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
    dates: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // eslint-disable-line
      allowNull: false,
    },
    flows: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // eslint-disable-line
      allowNull: false,
    },
  });
  FailedUpload.associate = models => {
    FailedUpload.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return FailedUpload;
};
