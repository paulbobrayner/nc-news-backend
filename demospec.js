process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const app = require('..app');
const request = require('supertest')(app);
const connection = require('../db/connection');

// have a describe block for each url

describe('api', () => {
  //   use a mocha hook before each  - execute before every it block
  //  knex will look for migration scripts
  beforeEach(() => {
    return connection.migrate
      .rollback() // must return promise as will return undefined - as it will wait for each return to fulfill before moving on.
      .then(() => connection.migrate.latest())
      .then(() => connection.seed.run());
  });
  after(() => {
    connection.destroy();
  }); // close connection after each test

  describe('/parties', () => {
    it('GET status:200 responds with an array of party objects', () => {
      //  not going to check length of array - as it changes as we progress testing
      return request // returning a promise
        .get('/api/parties')
        .expect(200)
        .then(({ body }) => {
          expect(body.parties).to.be.an('array');
          expect(body.parties[0]).contains.keys('party', 'founded');
        });
    });
  });
  describe('/mps/:mp_id', () => {
    it('GET status:200 responds with an mp object', () => {
      return request
        .get('/api/mps/1')
        .expect(200)
        .then(({ body }) => {
          expect(body.mp.name).to.equal('Jonathan Edwards');
          expect(body.mp.mp_id).to.equal(1);
        });
    });
    it('GET status:404 client uses non existent mp id', () => {
      return request.get('/api/mps/1000000').expect(404);
    });
    it('GET status:400 bad request- client uses invalid mp id', () => {
        return request.get('/api/mps/beanbag').expect(400);
  });
});