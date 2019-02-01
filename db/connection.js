// const knex = require('knex');

// const dbConfig = require('../knexfile');

// const connection = knex(dbConfig);

// //  connection object holds the methods(functions) we can use to interact with postgres database

// module.exports = connection;

const ENV = process.env.NODE_ENV || 'development';
const config = ENV === 'production'
  ? { client: 'pg', connection: process.env.DATABASE_URL }
  : require('../knexfile')[ENV];

module.exports = require('knex')(config);
