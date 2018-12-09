'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const allYear = sequelizeClient.define('Condition', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    conditions: {
      /* eslint-disable */
      type: DataTypes.ARRAY(
        DataTypes.ENUM('DRY', 'WET', 'MODERATE', 'NOT AVAILABLE')
      ),
      allowNull: true,
    },
  });
  allYear.associate = models => {
    allYear.belongsTo(models.Gauge, {
      foreignKey: 'gaugeId',
      as: 'gauge',
    });
  };
  return allYear;
};
