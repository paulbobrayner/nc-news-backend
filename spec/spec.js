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
    it('GET status:404 client uses non existent topic name', () => request.get('/api/topics/peterpan/articles').expect(404));

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
    it('GET status:200 will order articles by page starting at 0 (DEFAULT CASE) default limit 10 ', () => request
      .get('/api/topics/mitch/articles ')
      .expect(200)
      .then(({ body }) => {
        // console.log(body.articles);
        expect(body.articles[3].author).to.equal('rogersop');
      }));
    it('GET status:200 test 1/2 will order articles by page when requested, with a limit per page ', () => request
      .get('/api/topics/mitch/articles?p=2&&limit=2 ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Eight pug gifs that remind me of mitch');
      }));
    it('GET status:200 test 2/2 will order articles by page when requested, with a limit per page ', () => request
      .get('/api/topics/mitch/articles?p=3&&limit=4 ')
      .expect(200)
      .then(({ body }) => {
        // console.log(body.articles);
        expect(body.articles[2].title).to.equal('Z');
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
  describe('/articles', () => {
    it('GET status:200 responds with an array of article objects', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        // console.log(body);
        expect(body.articles).to.be.an('array');
        expect(body.articles[0]).contains.keys('votes', 'topic', 'article_id', 'author');
      }));
    it('GET status:200 responds with a comment count property within article objects - DESC by DEFAULT sorted by created_at default', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        // console.log(body.articles[0]);
        expect(body.articles[3].comment_count).to.equal('0');
        expect(body.articles[0]).contains.keys('comment_count');
      }));
    it('GET status:200 displays the total number of articles', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        // console.log(body);
        expect(body).contains.keys('total_count');
      }));
    it('GET status:404 client uses non existent path', () => request.get('/api/newspaper').expect(404));
    it('GET status:200 will default to giving back 10 articles as max (DEFAULT CASE)', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        // console.log(body.articles);
        expect(body.articles).to.have.length(10);
        expect(body.articles[3].title).to.equal('Student SUES Mitch!');
      }));
    it('GET status:200 will default to giving back the requested amount of articles', () => request
      .get('/api/articles?limit=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(3);
      }));
    it('GET status:200 will sort articles by date(created_at) (DEFAULT CASE) (DEFAULT DESC)', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        // console.log(body.articles[8]);
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
        expect(body.articles[9].title).to.equal(
          'Seven inspirational thought leaders from Manchester UK',
        );
      }));
    it('GET status:200 will sort articles by any column (DEFAULT DESC)', () => request
      .get('/api/articles?sort_by=title ')
      .expect(200)
      .then(({ body }) => {
        // console.log(body.articles[8]);
        expect(body.articles[2].title).to.equal("They're not exactly dogs, are they?");
        expect(body.articles[7].title).to.equal('Living in the shadow of a great man');
      }));
    it('GET status:200 will order articles by descending  (DEFAULT CASE) (DEFAULT sorted by --> created_at/date', () => request
      .get('/api/articles ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
        expect(body.articles[5].title).to.equal('A');
      }));
    it('GET status:200 will order articles by ascending when requested (DEFAULT sorted by --> created_at/date', () => request
      .get('/api/articles?order=asc ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Moustache');
        expect(body.articles[5].title).to.equal('Z');
      }));
    it('GET status:200 will order articles by ascending when requested and by a requested column', () => request
      .get('/api/articles?order=asc&&sort_by=article_id ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
        expect(body.articles[9].title).to.equal(
          'Seven inspirational thought leaders from Manchester UK',
        );
      }));
    it('GET status:200 will order articles by page starting at 0 (DEFAULT CASE) default limit 10 ', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[3].author).to.equal('rogersop');
        expect(body.articles[4].title).to.equal('UNCOVERED: catspiracy to bring down democracy');
      }));
    it('GET status:200 will order articles by page when requested, with a limit per page ', () => request
      .get('/api/articles?p=3&&limit=3 ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Student SUES Mitch!');
        expect(body.articles[2].title).to.equal('A');
        expect(body.articles).to.have.length(3);
      }));
    it('GET status:200 will order articles by page when requested, with a limit per page with a requested sort by and order', () => request
      .get('/api/articles?p=4&&limit=2&&sort_by=title&&order=asc ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
        expect(body.articles[1].title).to.equal('Moustache');
        expect(body.articles).to.have.length(2);
      }));
    it('GET status:200 client uses non existent path limit query but will respond with articles', () => request.get('/api/articles?limit=5billion').expect(200));
    it('GET status:200 responds with the articles requested by article id', () => request
      .get('/api/articles/3')
      .expect(200)
      .then(({ body }) => {
        expect(body.article.title).to.equal('Eight pug gifs that remind me of mitch');
        expect(body.article.author).to.equal('icellusedkars');
        expect(body.article).contains.keys('votes', 'body', 'created_at', 'title');
      }));
    it('GET status:400 bad request article_id will always be an integer', () => request
      .get('/api/articles/thisisnotanid')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).to.equal('please provide id in number format');
      }));
    it('GET status:200 responds with a comment count property within article object', () => request
      .get('/api/articles/4')
      .expect(200)
      .then(({ body }) => {
        // console.log(body.articles[0]);
        expect(body.article.comment_count).to.equal('0');
        expect(body.article).contains.keys('comment_count');
      }));
    it('GET status:404 client uses non existent path', () => request.get('/api/articles/2000000').expect(404));
    it('PATCH status:200 can change the vote property up or down', () => request
      .patch('/api/articles/4')
      .send({ inc_votes: 3 })
      .expect(20)
      .then(({ body }) => {
        // console.log(body)
        expect(body.articles.votes).to.equal('3');
      }));
    it('GET status:200 test 1/2 responds with an array of comment objects for given articleid', () => request
      .get('/api/articles/5/comments')
      .expect(200)
      .then(({ body }) => {
        //  console.log(body);
        expect(body.comments).to.have.length(2);
        expect(body.comments[0].votes).to.equal(16);
      }));
    it('GET status:200 test 2/2 responds with an array of comment objects for given articleid', () => request
      .get('/api/articles/9/comments')
      .expect(200)
      .then(({ body }) => {
        //  console.log(body);
        expect(body.comments).to.have.length(2);
        expect(body.comments[0].votes).to.equal(16);
      }));
    it('GET status:200 responds with an array of comment objects for given articleid with a default limit of 10 (DEFAULT CASE)', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        //  console.log(body);
        expect(body.comments).to.have.length(10);
        expect(body.comments[0].votes).to.equal(14);
      }));
    it('GET status:200 responds with an array of comment objects for given articleid with a requested limit', () => request
      .get('/api/articles/1/comments?limit=3')
      .expect(200)
      .then(({ body }) => {
        //  console.log(body);
        expect(body.comments).to.have.length(3);
      }));
    it('GET status:200 responds with comments sorted by date/created_at - DESC default (DEFAULT CASE)', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        //  console.log(body);
        expect(body.comments[2].author).to.equal('icellusedkars');
        expect(body.comments[2].votes).to.equal(-100);
      }));
    it('GET status:200 responds with comments sorted by requested column - DESC default', () => request
      .get('/api/articles/1/comments?sort_by=votes')
      .expect(200)
      .then(({ body }) => {
        //  console.log(body);
        expect(body.comments[2].author).to.equal('butter_bridge');
        expect(body.comments[2].votes).to.equal(14);
      }));
    it('GET status:200 will order comments by page starting at 0 (DEFAULT CASE) default limit 10 ', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[3].body).to.equal('I hate streaming noses');
        expect(body.comments[4].body).to.equal('I hate streaming eyes even more');
      }));
    it('GET status:200 will order comments by page requested- default limit 10 ', () => request
      .get('/api/articles/1/comments?p=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[2].body).to.equal('Lobster pot');
        expect(body.comments[5].body).to.equal('git push origin master');
      }));
    it('GET status:200 will order comments by page requested and with a limit per page', () => request
      .get('/api/articles/1/comments?p=3&&limit=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].body).to.equal('I hate streaming noses');
        expect(body.comments).to.have.length(3);
      }));
    it('POST status:201 responds with the posted topic object', () => {
      const comment = {
        username: 'butter_bridge',
        body: 'this is the worst article ever',
      };
      return request
        .post('/api/articles/1/comments')
        .send(comment)
        .expect(201)
        .then(({ body }) => {
          // console.log(body);
          expect(body.comment.body).to.equal('this is the worst article ever');
          expect(body.comment.article_id).to.equal(1);
        });
    });
    it('POST status:400 bad request request body in incorrect format', () => {
      const comment = {
        iamthebutter: 'butter_bridge',
        bodyiswrong: 'this is the worst article ever',
      };
      return request
        .post('/api/articles/1/comments')
        .send(comment)
        .expect(400);
    });
  });
});
