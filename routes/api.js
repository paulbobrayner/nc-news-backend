const apiRouter = require('express').Router();
const { topicsRouter } = require('../routes/topics.js');
const { articlesRouter } = require('../routes/articles');
const { usersRouter } = require('../routes/users.js');
const { getAllEndPoints } = require('../controllers/api.js');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.route('/').get(getAllEndPoints);

module.exports = apiRouter;
