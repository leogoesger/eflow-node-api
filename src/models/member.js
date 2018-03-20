'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const Member = sequelizeClient.define('Member', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    website: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    linkedin: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    twitter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    github: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    youtube: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    googleScholar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    researchGate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
  Member.associate = models => {
    Member.belongsToMany(models.Paper, {
      through: models.MemberPaper,
      foreignKey: 'memberId',
      as: 'papers',
    });
  };
  return Member;
};
