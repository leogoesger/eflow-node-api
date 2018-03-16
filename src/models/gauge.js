'use strict';

module.exports = (sequelize, DataTypes) => {
  const Gauge = sequelize.define('Gauge', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    stationName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    geometry: {
      type: DataTypes.JSONB, // eslint-disable-line
      allowNull: true,
    },
    unimpairedStartYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    unimpairedEndYear: {
      type: DataTypes.INTEGER,
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
  Gauge.associate = models => {
    Gauge.belongsTo(models.Classification, {
      foreignKey: 'classId',
      as: 'classes',
    });
    Gauge.hasMany(models.AllYear, {
      foreignKey: 'gaugeId',
      as: 'allYears',
    });
    Gauge.hasMany(models.Fall, {
      foreignKey: 'gaugeId',
      as: 'falls',
    });
    Gauge.hasMany(models.Spring, {
      foreignKey: 'gaugeId',
      as: 'springs',
    });
    Gauge.hasMany(models.Summer, {
      foreignKey: 'gaugeId',
      as: 'summers',
    });
    Gauge.hasMany(models.Winter, {
      foreignKey: 'gaugeId',
      as: 'winters',
    });
    Gauge.hasMany(models.Year, {
      foreignKey: 'gaugeId',
      as: 'years',
    });
    Gauge.hasMany(models.Hydrograph, {
      foreignKey: 'gaugeId',
      as: 'hydrographs',
    });
  };
  return Gauge;
};
