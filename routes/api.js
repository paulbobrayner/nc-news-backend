const apiRouter = require('express').Router();
const { topicsRouter } = require('../routes/topics.js');

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;
