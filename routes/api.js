const apiRouter = require('express').Router();
const { topicsRouter } = require('../routes/topics.js');
const { articlesRouter } = require('../routes/articles');
const { usersRouter } = require('../routes/users.js');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
