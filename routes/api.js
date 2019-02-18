const apiRouter = require('express').Router();
const { topicsRouter } = require('../routes/topics.js');
const { articlesRouter } = require('../routes/articles');
const { usersRouter } = require('../routes/users.js');
const { apiObj } = require('../home');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.get('/', (req, res, next) => {
  res.status(200).send(apiObj);
});

module.exports = apiRouter;
