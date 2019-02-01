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

articlesRouter.route('/').get(getArticles);
articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById)
  .delete(deleteArticle);
articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsById)
  .post(addCommentById);
articlesRouter
  .route('/:article_id/comments/:comment_id')
  .patch(updateCommentById)
  .delete(deleteComment);

module.exports = { articlesRouter };
