'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const Paper = sequelizeClient.define('Paper', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['HYDROLOGY', 'MORPHOLOGY', 'ECOLOGY', 'GENERAL'],
    },
    authors: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // eslint-disable-line
      allowNull: true,
    },
    publishedDate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paperUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imgUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
  Paper.associate = models => {
    Paper.belongsToMany(models.Member, {
      through: models.MemberPaper,
      foreignKey: 'paperId',
      as: 'members',
    });
  };
  return Paper;
};
