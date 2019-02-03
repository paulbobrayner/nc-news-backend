const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const {
  handle400, handle404, handle405, handle422, handle500,
} = require('./errors/errors');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(handle400);
app.use(handle404);
app.use(handle405);
app.use(handle422);
app.use(handle500);

module.exports = app;
