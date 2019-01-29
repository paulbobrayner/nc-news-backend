process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const app = require('..app');
const request = require('supertest')(app);
const connection = require('../db/connection');
