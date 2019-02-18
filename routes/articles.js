const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticleById,
  updateArticleById,
  getCommentsById,
  addCommentById,
  deleteArticle,
  updateCommentById,
  deleteComment,
} = require('../controllers/articles.js');
const { handle405 } = require('../errors/errors');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(handle405);
articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById)
  .delete(deleteArticle)
  .all(handle405);
articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsById)
  .post(addCommentById)
  .all(handle405);
articlesRouter
  .route('/:article_id/comments/:comment_id')
  .patch(updateCommentById)
  .delete(deleteComment)
  .all(handle405);

module.exports = { articlesRouter };
