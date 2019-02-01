const apiRouter = require('express').Router();
const { topicsRouter } = require('../routes/topics.js');
const { articlesRouter } = require('../routes/articles');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;
