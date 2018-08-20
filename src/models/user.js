'use strict';
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    role: {
      type: DataTypes.ENUM,
      values: ['USER', 'ADMIN', 'SUPER_ADMIN'],
      defaultValue: 'USER',
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    institution: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  User.associate = models => {
    User.hasMany(models.UploadData, {
      foreignKey: 'userId',
      as: 'uploadData',
    });
  };

  User.findByToken = token => {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.FF_JWT_TOKEN);
      return User.find({where: {email: decoded.email}});
    } catch (e) {
      return Promise.reject();
    }
  };

  User.findByTokenAdmin = token => {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.FF_JWT_TOKEN);
      const role = decoded.role;
      if (role !== 'ADMIN') {
        return Promise.reject();
      }
      return User.find({where: {email: decoded.email}});
    } catch (e) {
      return Promise.reject();
    }
  };

  return User;
};
