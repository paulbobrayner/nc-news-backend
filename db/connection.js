const knex = require('knex');

const dbConfig = require('../knexfile');

const connection = knex(dbConfig);

//  connection object holds the methods(functions) we can use to interact with postgres database

module.exports = connection;
