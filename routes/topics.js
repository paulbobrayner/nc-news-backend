const topicsRouter = require('express').Router();
const {
  getTopics,
  addTopic,
  getArticlesFromTopic,
  addArticle,
} = require('../controllers/topics.js');
const { handle405 } = require('../errors/errors');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(addTopic)
  .all(handle405);

topicsRouter
  .route('/:topic/articles')
  .get(getArticlesFromTopic)
  .post(addArticle)
  .all(handle405);

module.exports = { topicsRouter };
