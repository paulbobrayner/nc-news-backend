const topicsRouter = require('express').Router();
const {
  getTopics,
  addTopic,
  getArticlesFromTopic,
} = require('../controllers/topics.js');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(addTopic);

topicsRouter.route('/:topic/articles').get(getArticlesFromTopic);

module.exports = { topicsRouter };
