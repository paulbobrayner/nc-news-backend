const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticleById,
  updateArticleById,
  getCommentsById,
  addCommentById,
} = require('../controllers/articles.js');

articlesRouter.route('/').get(getArticles);
articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById);
articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsById)
  .post(addCommentById);

module.exports = { articlesRouter };
