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
  it('GET 200, responds with a homepage containing a JSON object with all endpoints', () => request
    .get('/api')
    .expect(200)
    .then(({ body }) => {
      expect(body).contains.keys('/api/topics', '/api/topics/:topic/articles', '/api/articles', '/api/articles/:article_id', '/api/articles/:article_id/comments', '/api/users', '/api/users/:username', '/api/users/:username/articles');
    }));
  describe('/topics', () => {
    it('GET status:200 responds with an array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).contains.keys('slug', 'description');
      }));
    it('PATCH status 405 invalid method on this endpoint', () => request
      .patch('/api/topics')
      .expect(405));
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
    it('POST status:422 -unprocessable entity duplicate content ', () => {
      const topic = {
        slug: 'cats',
        description: 'sloth',
      };
      return request
        .post('/api/topics')
        .send(topic)
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.equal('duplicate key');
        });
    });
    it('GET status:200 responds with the articles requested by topic', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(9);
      }));
    it('GET status:404 client uses non existent topic name', () => request.get('/api/topics/peterpan/articles').expect(404));

    it('GET status:200 responds with author as the username within article object', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
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
        expect(body).contains.keys('total_count');
      }));
    it('GET status:200 will default to giving back 10 article objects as max - mitch only has 9 (DEFAULT CASE)', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(9);
      }));
    it('GET status:200 will default to giving back the requested limit', () => request
      .get('/api/topics/mitch/articles?limit=4')
      .expect(200)
      .then(({ body }) => {
        // console.log(body)
        expect(body.articles).to.have.length(4);
      }));
    it('GET status:200 client uses non existent path limit query but will return with default response', () => request.get('/api/topics/mitch/articles?limit=chickens').expect(200));
    it('GET status:200 will sort articles by date(created_at) (DEFAULT CASE) (DEFAULT DESC)', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].votes).to.equal(100);
        expect(body.articles[8].article_id).to.equal(11);
      }));
    it('GET status:200 will sort articles by any column (DEFAULT DESC)', () => request
      .get('/api/topics/mitch/articles?sort_by=author ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[2].author).to.equal('icellusedkars');
        expect(body.articles[7].author).to.equal('butter_bridge');
      }));
    it('GET status:200 client uses non existent path sort_by query but will return with default response', () => request.get('/api/topics/mitch/articles?sort_by=piglets').expect(200));
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
    it('GET status:200 client uses non existent path limit query but will return with default response - desc', () => request.get('/api/topics/mitch/articles?order=makeitgodown').expect(200));

    it('GET status:200 will order articles by ascending when requested and by a requested column', () => request
      .get('/api/topics/mitch/articles?order=asc&&sort_by=title ')
      .expect(200)
      .then(({ body }) => {
        // console.log(body)
        expect(body.articles[2].title).to.equal('Does Mitch predate civilisation?');
        expect(body.articles[3].title).to.equal('Eight pug gifs that remind me of mitch');
      }));
    it('GET status:200 will order articles by page starting at 1 (DEFAULT CASE) default limit 10 ', () => request
      .get('/api/topics/mitch/articles ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[3].author).to.equal('rogersop');
      }));
    it('GET status:200 client uses non existent path limit query but will return with default response - page 1', () => request.get('/api/topics/mitch/articles?p=thisisnotapagenumber').expect(200));

    it('GET status:200 test 1/2 will order articles by page when requested, with a limit per page ', () => request
      .get('/api/topics/mitch/articles?p=2&&limit=3 ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Student SUES Mitch!');
        expect(body.articles[1].article_id).to.equal(6);
      }));
    it('GET status:200 test 2/2 will order articles by page when requested, with a limit per page ', () => request
      .get('/api/topics/mitch/articles?p=2&&limit=2 ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Eight pug gifs that remind me of mitch');
        expect(body.articles).to.have.length(2);
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
          expect(body.article.title).to.equal('Should I sail the seven seas?');
        });
    });
    it('POST status:404 client adds article to a non existent topic, returns 404', () => {
      const article = {
        title: 'Should I sail the seven seas?',
        body: 'Just brainstorming sailing inspo on pinterest',
        username: 'icellusedkars',
      };
      return request
        .post('/api/topics/shrek/articles')
        .send(article)
        .expect(404);
    });
    it('POST status:400 bad request, body malformed - missing body', () => {
      const article = {
        title: 'Should I sail the seven seas?',
      };
      return request
        .post('/api/topics/mitch/articles')
        .send(article)
        .expect(400);
      // .then(({ body }) => {
      //   expect(body.article.title).to.equal('Should I sail the seven seas?');
      // });
    });
  });
  describe('/articles', () => {
    it('GET status:200 responds with an array of article objects', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.be.an('array');
        expect(body.articles[0]).contains.keys('votes', 'topic', 'article_id', 'author');
      }));
    it('PATCH status 405 invalid method on this endpoint', () => request
      .patch('/api/articles')
      .expect(405));
    it('GET status:200 responds with a comment count property within article objects - DESC by DEFAULT sorted by created_at default', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[3].comment_count).to.equal('0');
        expect(body.articles[0]).contains.keys('comment_count');
      }));
    it('GET status:200 displays the total number of articles', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body).contains.keys('total_count');
      }));
    it('GET status:200 will default to giving back 10 articles as max (DEFAULT CASE)', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(10);
        expect(body.articles[3].title).to.equal('Student SUES Mitch!');
      }));
    it('GET status:200 will default to giving back the requested amount of articles', () => request
      .get('/api/articles?limit=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(3);
      }));
    it('GET status:200 client uses non existent path limit query but will return with default response - 10', () => request.get('/api/articles?limit=thisisnotanumber').expect(200));

    it('GET status:200 will sort articles by date(created_at) (DEFAULT CASE) (DEFAULT DESC)', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
        expect(body.articles[9].title).to.equal(
          'Seven inspirational thought leaders from Manchester UK',
        );
      }));
    it('GET status:200 will sort articles by any column (DEFAULT DESC)', () => request
      .get('/api/articles?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[2].title).to.equal("They're not exactly dogs, are they?");
        expect(body.articles[7].title).to.equal('Living in the shadow of a great man');
      }));
    it('GET status:200 client uses non existent path sort_by query but will return with default response - created_at', () => request.get('/api/articles?sort_by=justsortit').expect(200));

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
        expect(body.articles[0].title).to.equal('Z');
        expect(body.articles[2].title).to.equal('They\'re not exactly dogs, are they?');
        expect(body.articles).to.have.length(3);
      }));
    it('GET status:200 client uses non existent path limit query but will return with default response - page 1', () => request.get('/api/articles?p=thisisnotapagenumber').expect(200));

    it('GET status:200 will order articles by page when requested, with a limit per page with a requested sort by and order', () => request
      .get('/api/articles?p=4&&limit=2&&sort_by=title&&order=asc ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].title).to.equal('Seven inspirational thought leaders from Manchester UK');
        expect(body.articles[1].title).to.equal('Sony Vaio; or, The Laptop');
        expect(body.articles).to.have.length(2);
      }));
    it('GET status:200 client uses non existent path limit query but will respond with articles', () => request.get('/api/articles?limit=billion').expect(200));
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
        expect(body.article.comment_count).to.equal('0');
        expect(body.article).contains.keys('comment_count');
      }));
    it('GET status:404 client uses non existent path', () => request.get('/api/articles/2000000').expect(404));
    it('PATCH status:200 can change the vote property up or down', () => request
      .patch('/api/articles/1')
      .send({ inc_votes: 3 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).to.equal(103);
      }));
    it('PATCH status:400 bad request', () => request
      .patch('/api/articles/1')
      .send({ inc_votes: 'fivehundred' })
      .expect(400));
    it('PATCH status:200, no body passed, but responds with unmodified article, votes are not modified ', () => request
      .patch('/api/articles/1')
      .send({})
      .expect(200)
      .then(({ body }) => {
        expect(body.article.body).to.equal('I find this existence challenging');
      }));
    it('DELETE status:204 can delete an article by article id', () => request
      .delete('/api/articles/2')
      .expect(204)
      .then(({ body }) => {
        expect(body).to.eql({});
      }));
    it('DELETE status:404 path does not exist non existent article id', () => request
      .delete('/api/articles/2000')
      .expect(404));
    it('GET status:200 test 1/2 responds with an array of comment objects for given articleid', () => request
      .get('/api/articles/5/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.length(2);
        expect(body.comments[0].votes).to.equal(16);
      }));
    it('GET status:200 test 2/2 responds with an array of comment objects for given articleid', () => request
      .get('/api/articles/9/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.length(2);
        expect(body.comments[0].votes).to.equal(16);
      }));
    it('GET status:200 responds with an array of comment objects for given articleid with a default limit of 10 (DEFAULT CASE)', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.length(10);
        expect(body.comments[0].votes).to.equal(14);
      }));
    it('GET status:200 responds with an array of comment objects for given articleid with a requested limit', () => request
      .get('/api/articles/1/comments?limit=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).to.have.length(3);
      }));
    it('GET status:200 client uses non existent path limit query but will return with default response - 10', () => request.get('/api/articles/1/comments?limit=imnotanumber').expect(200));

    it('GET status:200 responds with comments sorted by date/created_at - DESC default (DEFAULT CASE)', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[2].author).to.equal('icellusedkars');
        expect(body.comments[2].votes).to.equal(-100);
      }));
    it('GET status:200 responds with comments sorted by requested column - DESC default', () => request
      .get('/api/articles/1/comments?sort_by=votes')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[2].author).to.equal('butter_bridge');
        expect(body.comments[2].votes).to.equal(14);
      }));
    it('GET status:200 client uses non existent path sort_by query but will return with default response - created_at', () => request.get('/api/articles/1/comments?sort_by=nothing').expect(200));

    it('GET status:200 will order comments by page starting at 0 (DEFAULT CASE) default limit 10 ', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[3].body).to.equal('I hate streaming noses');
        expect(body.comments[4].body).to.equal('I hate streaming eyes even more');
      }));
    it('GET status:200 client uses non existent path page query but will return with default response - page 1', () => request.get('/api/articles/1/comments?p=imnotanumber').expect(200));

    it('GET status:200 will order comments by page requested- default limit 10 ', () => request
      .get('/api/articles/1/comments?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[2].body).to.equal('This morning, I showered for nine minutes.');
        expect(body.comments[0].comment_id).to.equal(12);
      }));
    it('GET status:200 will order comments by page requested and with a limit per page', () => request
      .get('/api/articles/1/comments?p=3&&limit=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].body).to.equal('Delicious crackerbreads');
        expect(body.comments).to.have.length(3);
      }));
    it('GET status:200 responds with comments in descending order (DEFAULTCASE)', () => request
      .get('/api/articles/5/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0].author).to.equal('icellusedkars');
        expect(body.comments).to.have.length(2);
      }));
    it('GET status:200 responds with comments in ascending order when sort_ascending is true', () => request
      .get('/api/articles/1/comments?sort_ascending=true')
      .expect(200)
      .then(({ body }) => {
        // console.log(body);
        expect(body.comments[0].author).to.equal('butter_bridge');
        expect(body.comments[2].body).to.equal('Massive intercranial brain haemorrhage');
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
    it('PATCH status:200 can change the vote property up or down', () => request
      .patch('/api/articles/1/comments/4')
      .send({ inc_votes: 3 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.votes).to.equal(-97);
      }));
    it('PATCH status:400 bad request', () => request
      .patch('/api/articles/1/comments/4')
      .send({ inc_votes: 'fivehundred' })
      .expect(400));
    it('PATCH status:200 no body given, results in an unmodified comment', () => request
      .patch('/api/articles/1/comments/4')
      .send({})
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.body).to.equal(' I carry a log — yes. Is it funny to you? It is not to me.');
      }));
    it('PATCH status:404 not found - non existent article_id used', () => request
      .patch('/api/articles/2000/comments/4')
      .send({ inc_votes: 3 })
      .expect(404));
    it('PATCH status:404 not found - non existent comment_id used', () => request
      .patch('/api/articles/2/comments/4000')
      .send({ inc_votes: 3 })
      .expect(404));
    it('PATCH status:200 can change the vote property up or down', () => request
      .patch('/api/articles/1/comments/2')
      .send({ inc_votes: -20 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.votes).to.equal(-6);
      }));
    it('DELETE status:204 can delete an comment by article id and comment id', () => request
      .delete('/api/articles/1/comments/2')
      .expect(204)
      .then(({ body }) => {
        expect(body).to.eql({});
      }));
    it('DELETE status:404 path does not exist', () => request
      .delete('/api/articles/2000/comments/2')
      .expect(404));
  });
  describe('/users', () => {
    it('GET status:200 responds with an array of user objects', () => request
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users).to.have.length(3);
        expect(body.users[0]).contains.keys('username', 'avatar_url', 'name');
      }));
    it('DELETE status 405 invalid method on this endpoint', () => request
      .delete('/api/users')
      .expect(405));
    it('POST status:201 responds with posted user object', () => {
      const user = {
        username: 'testingtesting',
        avatar_url: 'https://thisisanewavatar.com',
        name: 'paul2',
      };
      return request
        .post('/api/users')
        .send(user)
        .expect(201)
        .then(({ body }) => {
          expect(body.user.name).to.equal('paul2');
          expect(body.user).contains.keys('name', 'avatar_url', 'username');
        });
    });
    it('POST status:400 bad request request body in incorrect format', () => {
      const user = {
        usernot: 'testingtesting',
        avatarthefilm: 'https://thisisanewavatar.com',
        name: 'paul2',
      };
      return request
        .post('/api/users')
        .send(user)
        .expect(400);
    });
    it('GET status:200 gets user by username', () => request
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({ body }) => {
        expect(body.user.username).to.equal('butter_bridge');
        expect(body.user.name).to.equal('jonny');
      }));
    it('GET status:404 client uses non existent path- username doesnt exist', () => request.get('/api/users/wrongusername').expect(404));
    it('GET status:200 responds with an array of article objects created by a user', () => request
      .get('/api/users/butter_bridge/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(3);
        expect(body.articles[0].title).to.equal('Living in the shadow of a great man');
      }));
    it('GET status:200 responds with a comment count property within article objects', () => request
      .get('/api/users/butter_bridge/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].comment_count).to.equal('13');
        expect(body.articles[0]).contains.keys('comment_count');
      }));
    it('GET status:200 displays the total number of articles by user', () => request
      .get('/api/users/butter_bridge/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body).contains.keys('total_count');
      }));
    it('GET status:200 will default to giving back 10 articles by user as max (DEFAULT CASE)', () => request
      .get('/api/users/rogersop/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(3);
        expect(body.articles[0].title).to.equal('Student SUES Mitch!');
      }));
    it('GET status:200 will respond with requested limit of articles by user', () => request
      .get('/api/users/icellusedkars/articles?limit=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(3);
        expect(body.articles[0].title).to.equal('Sony Vaio; or, The Laptop');
      }));
    it('GET status:200 client uses non existent path limit query but will return with default response - 10', () => request.get('/api/users/icellusedkars/articles?limit=iwanttobeanumber').expect(200));

    it('GET status:200 responds with articles by user sorted by date/created_at column - DESC default (DEFAULT CASE)', () => request
      .get('/api/users/icellusedkars/articles')
      .expect(200)
      .then(({ body }) => {
        //  console.log(body);
        expect(body.articles[0].article_id).to.equal(2);
        expect(body.articles[2].title).to.equal('A');
      }));
    it('GET status:200 responds with articles by user sorted by requested column - DESC default', () => request
      .get('/api/users/icellusedkars/articles?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        //  console.log(body);
        expect(body.articles[0].article_id).to.equal(7);
        expect(body.articles[2].title).to.equal('Eight pug gifs that remind me of mitch');
      }));
    it('GET status:200 client uses non existent path sort_by query but will return with default response - created_at', () => request.get('/api/users/icellusedkars/articles?sort_by=awrongtitle').expect(200));

    it('GET status:200 will order articles by user by descending  (DEFAULT CASE) (DEFAULT sorted by --> created_at/date', () => request
      .get('/api/users/rogersop/articles ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.equal(4);
        expect(body.articles[2].title).to.equal(
          'Seven inspirational thought leaders from Manchester UK',
        );
      }));
    it('GET status:200 will order articles by user in ascending order when requested (DEFAULT sorted by --> created_at/date', () => request
      .get('/api/users/icellusedkars/articles?order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).to.equal(11);
        expect(body.articles[2].title).to.equal('Z');
      }));
    it('GET status:200 will order articles by user by page starting at 1 (DEFAULT CASE) default limit 10 ', () => request
      .get('/api/users/icellusedkars/articles ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[3].title).to.equal('Z');
      }));
    it('GET status:200 client uses non existent path page query but will return with default response - page 1', () => request.get('/api/users/icellusedkars/articles?p=iwanttobeanumber').expect(200));

    it('GET status:200 will order articles by user by requested page default limit 10 ', () => request
      .get('/api/users/icellusedkars/articles?p=2 ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.eql([]);
      }));
    it('GET status:200 will order articles by user by requested page and limit', () => request
      .get('/api/users/icellusedkars/articles?p=2&&limit=2 ')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).to.have.length(2);
        expect(body.articles[0].title).to.equal('A');
      }));
  });
});
