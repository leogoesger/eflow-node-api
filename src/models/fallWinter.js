'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const FallWinter = sequelizeClient.define('FallWinter', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    magWet: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), // eslint-disable-line
      allowNull: true,
    },
  });
  FallWinter.associate = models => {
    FallWinter.belongsTo(models.Gauge, {
      foreignKey: 'gaugeId',
      as: 'gauge',
    });
  };
  return FallWinter;
};
