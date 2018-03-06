/* eslint-disable global-require  */
const Sequelize = require('sequelize');
require('dotenv').config({path: '.env'});
const Op = Sequelize.Op;

module.exports = {
  development: {
    username: 'postgres',
    password: null,
    database: 'eflow_development',
    host: '127.0.0.1',
    post: 5432,
    dialect: 'postgres',
    logging: false,
    operatorsAliases: Op,
  },
  test: {
    username: 'postgres',
    password: null,
    database: 'eflow_test',
    host: '127.0.0.1',
    post: 5432,
    dialect: 'postgres',
    logging: false,
    operatorsAliases: Op,
  },
  production: {
    username: 'production',
    password: 'production123',
    database: 'eflow_production',
    host: '127.0.0.1',
    post: 5432,
    dialect: 'postgres',
    logging: false,
    operatorsAliases: Op,
  },
};
