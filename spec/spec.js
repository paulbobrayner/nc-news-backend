process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const connection = require('../db/connection');

describe('api', () => {
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => {
    connection.destroy();
  });

  describe('/topics', () => {
    it('GET status:200 responds with an array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).contains.keys('slug', 'description');
      }));
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
          // is the above cheating the test????
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
          // console.log(body);
          expect(body.msg).to.equal('request body provided is in incorrect format');
        });
    });
    it('GET status:200 responds with the articles requested by topic', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        // console.log(body.articles);
        expect(body.articles).to.have.length(9);
      }));
    it('GET status:404 client uses non existent topic name', () => request
      .get('/api/topics/peterpan/articles')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal('article not found');
      }));
    it('GET status:200 responds with author as the username within article object', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        // console.log(body.articles);
        expect(body.articles[0]).contains.keys('author');
      }));
    it('GET status:200 responds with count of comments for each article for requested topic', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0]).contains.keys('comment_count');
        expect(body.articles[0].comment_count).to.equal('13');
      }));
    it('GET status:200 displays the total number of articles for the given topic', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        // console.log(body);
        expect(body).contains.keys('total_count');
      }));
    it('GET 200 will default to giving back 10 article objects as max (DEFAULT CASE)', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(9);
      }));
    it('GET 200 will default to giving back the requested amount', () => request
      .get('/api/topics/mitch/articles?limit=4')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(4);
      }));
    it('GET 200 will sort articles by date(created_at) (DEFAULT CASE) (DEFAULT DESC)', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        // console.log(body.articles[8]);
        expect(body.articles[0].votes).to.equal(100);
        expect(body.articles[8].article_id).to.equal(11);
      }));
    it('GET 200 will sort articles by any column (DEFAULT DESC)', () => request
      .get('/api/topics/mitch/articles?sort_by=votes')
      .expect(200)
      .then(({ body }) => {
        // console.log(body.articles[8]);
        expect(body.articles[0].votes).to.equal(100);
        expect(body.articles[8].article_id).to.equal(11);
      }));
  });
});
