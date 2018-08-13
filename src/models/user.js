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
    middleName: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
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
    address1: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    address2: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    zip: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
  });

  User.findByToken = token => {
    let decoded;
    try {
      console.log(token, process.env.FF_JWT_TOKEN); //eslint-disable-line
      console.log(jwt.verify(token, process.env.FF_JWT_TOKEN));
      decoded = jwt.verify(token, process.env.FF_JWT_TOKEN);
      return User.find({where: {email: decoded.email}});
    } catch (e) {
      return Promise.reject();
    }
  };

  return User;
};
