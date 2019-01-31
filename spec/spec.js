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
          // console.log(body);
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
    it('GET status:200 will default to giving back 10 article objects as max (DEFAULT CASE)', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(9);
      }));
    it('GET status:200 will default to giving back the requested amount', () => request
      .get('/api/topics/mitch/articles?limit=4')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(4);
      }));
    it('GET status:200 will sort articles by date(created_at) (DEFAULT CASE) (DEFAULT DESC)', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        // console.log(body.articles[8]);
        expect(body.articles[0].votes).to.equal(100);
        expect(body.articles[8].article_id).to.equal(11);
      }));
    it('GET status:200 will sort articles by any column (DEFAULT DESC)', () => request
      .get('/api/topics/mitch/articles?sort_by=author ')
      .expect(200)
      .then(({ body }) => {
        // console.log(body.articles[8]);
        expect(body.articles[2].author).to.equal('icellusedkars');
        expect(body.articles[7].author).to.equal('butter_bridge');
      }));
    it('GET status:200 will order articles by descending  (DEFAULT CASE) (DEFAULT sorted by --> created_at/date', () => request
      .get('/api/topics/mitch/articles ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
        expect(body.articles[5].title).to.equal('Z');
      }));
    it('GET status:200 will order articles by ascending when requested (DEFAULT sorted by --> created_at/date', () => request
      .get('/api/topics/mitch/articles?order=asc ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Am I a cat?');
        expect(body.articles[5].title).to.equal('Student SUES Mitch!');
      }));
    it('GET status:200 will order articles by ascending when requested and by a requested column', () => request
      .get('/api/topics/mitch/articles?order=asc&&sort_by=title ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[2].title).to.equal('Does Mitch predate civilisation?');
        expect(body.articles[3].title).to.equal('Eight pug gifs that remind me of mitch');
      }));
    it('POST status:201 responds with the posted article object', () => {
      const article = {
        title: 'Should I sail the seven seas?',
        body: 'Just brainstorming sailing inspo on pinterest',
        username: 'icellusedkars',
      };
      return request
        .post('/api/topics/mitch/articles')
        .send(article)
        .expect(201)
        .then(({ body }) => {
          // console.log(body.article);
          expect(body.article.title).to.equal('Should I sail the seven seas?');
        });
    });
  });
});
