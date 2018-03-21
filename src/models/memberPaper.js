'use strict';

module.exports = (sequelizeClient, DataTypes) => {
  const MemberPaper = sequelizeClient.define('MemberPaper', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    memberId: DataTypes.INTEGER,
    paperId: DataTypes.INTEGER,
  });

  return MemberPaper;
};
