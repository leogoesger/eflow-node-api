'use strict';

module.exports = (sequelize, DataTypes) => {
  const Classification = sequelize.define('Classification', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hydrograph_10: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    hydrograph_25: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    hydrograph_50: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    hydrograph_75: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    hydrograph_90: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Avg: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    Std: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    CV: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    SP_Tim: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    SP_Mag: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    SP_Dur: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    SP_ROC: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    SU_BFL_Tim: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    SU_BFL_Mag_10: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    SU_BFL_Mag_50: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    SU_BFL_Dur_Fl: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    SU_BFL_Dur_Wet: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    SU_BFL_No_Flow: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    FAFL_Tim: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    FAFL_Mag: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    FAFL_Tim_Wet: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    FAFL_Dur: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Wet_BFL_Mag: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Tim_2: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Dur_2: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Fre_2: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Tim_5: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Dur_5: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Fre_5: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Tim_10: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Dur_10: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Fre_10: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Tim_20: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Dur_20: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Fre_20: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Tim_50: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Dur_50: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WIN_Fre_50: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
  });
  Classification.associate = models => {
    Classification.hasMany(models.Gauge, {
      foreignKey: 'classId',
      as: 'gauges',
    });
    Classification.hasMany(models.GeoClass, {
      foreignKey: 'classId',
      as: 'geoclasses',
    });
  };
  return Classification;
};
