const {
  fetchArticles,
  getTotalCount,
  fetchArticleById,
  modifyArticle,
  fetchCommentsById,
  postCommentById,
} = require('../db/models/articles');

exports.getArticles = (req, res, next) => {
  // console.log(req);
  fetchArticles(req.query)
    .then(articles => Promise.all([getTotalCount(), articles]))
    .then(([total_count, articles]) => {
      if (total_count.length === 0) return Promise.reject({ status: 404, message: 'article not found' });
      return res.status(200).send({ total_count, articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  // console.log(req.params.article_id);
  fetchArticleById(req.params.article_id)
    .then(([article]) => {
      // console.log(article);
      if (!article) return Promise.reject({ status: 404, message: 'article not found' });
      return res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleById = (req, res, next) => {
  console.log(req.body.inc_votes);
  // console.log(req.params.article_id);
  modifyArticle(req.params.article_id, req.body.inc_votes)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsById = (req, res, next) => {
  fetchCommentsById(req.params.article_id, req.query).then((comments) => {
    res.status(200).send({ comments });
  });
};

exports.addCommentById = (req, res, next) => {
  // console.log(req.params);
  // console.log(req.body);
  postCommentById(req.body, req.params)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
