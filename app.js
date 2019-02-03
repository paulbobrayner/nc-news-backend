const app = require('express')();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const { handle400, handle404 } = require('./errors/errors');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(handle400);
app.use(handle404);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ msg: 'Internal server error' });
});

module.exports = app;
