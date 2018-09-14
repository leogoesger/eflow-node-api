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
    abbreviation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Avg: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    Std: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    CV: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    SP_Tim: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    SP_Mag: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    SP_Dur: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    SP_ROC: {type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), allowNull: true}, //eslint-disable-line
    DS_Tim: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    DS_Mag_10: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    DS_Mag_50: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    DS_Dur_Fl: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    DS_Dur_Wet: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    DS_No_Flow: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WSI_Tim: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WSI_Mag: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Wet_Tim: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    WSI_Dur: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Wet_BFL_Mag: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Tim_2: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Dur_2: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Fre_2: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Tim_5: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Dur_5: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Fre_5: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Tim_10: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Dur_10: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Fre_10: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Tim_20: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Dur_20: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Fre_20: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Tim_50: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Dur_50: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
    Peak_Fre_50: {
      type: DataTypes.ARRAY(DataTypes.DECIMAL(10, 2)), //eslint-disable-line
      allowNull: true,
    },
  });
  Classification.associate = models => {
    Classification.hasMany(models.Gauge, {
      foreignKey: 'classId',
      as: 'gauges',
    });
    Classification.hasMany(models.Hydrograph, {
      foreignKey: 'classId',
      as: 'hydrographs',
    });
  };
  return Classification;
};
