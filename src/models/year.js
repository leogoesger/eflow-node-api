'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const Year = sequelizeClient.define('Year', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    year: {
      type: DataTypes.ARRAY(DataTypes.INTEGER), // eslint-disable-line
      allowNull: true,
    },
  });
  Year.associate = models => {
    Year.belongsTo(models.Gauge, {
      foreignKey: 'gaugeId',
      as: 'gauge',
    });
  };
  return Year;
};
