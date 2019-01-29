process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const connection = require('../db/connection');

describe('api', () => {
  beforeEach(() => {
    return connection.migrate
      .rollback()
      .then(() => connection.migrate.latest())
      .then(() => connection.seed.run());
  });
  after(() => {
    connection.destroy();
  });

  describe('/topics', () => {
    it('GET status:200 responds with an array of topic objects', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.be.an('array');
          expect(body.topics[0]).contains.keys('slug', 'description');
        });
    });
    it('POST status:201 responds with the posted topic object', () => {
      const topic = {
        description: 'sloths like to hang on trees',
        slug: 'sloth',
      };
      return request
        .post('/api/topics')
        .send(topic)
        .expect(201)
        .then(({ body }) => {
          //  console.log(body);
          expect(body.topic.slug).to.equal('sloth');
        });
    });
    it('POST status:400 bad request, request body in incorrect format ', () => {
      const topic = {
        sloth: 'sloths like to hang on trees',
        snail: 'sloth',
      };
      return request
        .post('/api/topics')
        .send(topic)
        .expect(400)
        .then(({ body }) => {
          expect().to.equal();
        });
    });
  });
});
