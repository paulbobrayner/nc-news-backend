const topicsRouter = require('express').Router();
const { getTopics, addTopic } = require('../controllers/topics.js');

topicsRouter
  .route('/')
  .get(getTopics)
  .post(addTopic);

module.exports = { topicsRouter };
