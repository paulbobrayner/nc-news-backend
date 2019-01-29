const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const { handle400 } = require('./errors/errors');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(handle400);

module.exports = app;
