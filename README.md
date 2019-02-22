## NC News Backend

Backend RESTful API for NC news portfolio piece serving various endpoints.

## Getting started

Fork and clone this repositary from github.

## Installing

Install dependencies

```
npm install
```

Create a knexfile.js with the information below.

```const ENV = process.env.NODE_ENV || 'development';
const { DB_URL } = process.env;

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: 'db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};

const customConfigs = {
  development: {
    connection: {
      database: 'nc_knews',
    },
  },
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
  test: {
    connection: {
      database: 'nc_knews_test',
    },
  },
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };

```

## Running the tests

Test have been built with mocha and chai.

Example

```
describe('/topics', () => {
    it('GET status:200 responds with an array of topic objects', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).to.be.an('array');
        expect(body.topics[0]).contains.keys('slug', 'description');
      }));
```

Run the tests with

```
npm test
```

## Built with

- [POSTGRES](https://www.postgresql.org/docs/) - The database used.
- [KNEX](https://knexjs.org/) - Query builder for postgres.
- [EXPRESS](https://expressjs.com/) - Web APP framework for
