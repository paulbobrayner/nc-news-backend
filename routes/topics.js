const topicsRouter = require('express').Router();
const {
  getTopics,
  addTopic,
  getArticlesFromTopic,
  addArticle,
} = require('../controllers/topics.js');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(addTopic);

topicsRouter
  .route('/:topic/articles')
  .get(getArticlesFromTopic)
  .post(addArticle);

module.exports = { topicsRouter };
