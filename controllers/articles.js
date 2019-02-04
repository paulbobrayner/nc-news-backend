const {
  fetchArticles,
  getTotalCount,
  fetchArticleById,
  modifyArticle,
  fetchCommentsById,
  postCommentById,
  removeArticle,
  modifyComment,
  removeComment,
} = require('../db/models/articles');

exports.getArticles = (req, res, next) => {
  const columns = ['title', 'votes', 'topic', 'article_id', 'created_at', 'username'];
  let { sort_by, limit, p } = req.query;
  // console.log(p);
  if (Number.isNaN(+p)) p = 1;
  if (Number.isNaN(+limit)) limit = 10;
  if (!columns.includes(sort_by)) sort_by = 'created_at';
  fetchArticles({
    ...req.query,
    sort_by,
    limit,
    p,
  })
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
  const { inc_votes } = req.body;
  // console.log(Number.isNaN(inc_votes));
  if (Number.isNaN(+inc_votes)) next({ code: 400 });
  else {
    modifyArticle(req.params.article_id, inc_votes)
      .then(([article]) => {
        // console.log(article);
        if (!article) return Promise.reject({ status: 404, message: 'article not found' });
        return res.status(200).send({ article });
      })
      .catch(next);
  }
};

exports.deleteArticle = (req, res, next) => {
  removeArticle(req.params.article_id)
    .then((result) => {
      // console.log(result);
      if (result.length === 0) return Promise.reject({ status: 404, message: 'article id not found' });
      return res.status(204).send(result);
    })
    .catch(next);
};

exports.getCommentsById = (req, res, next) => {
  const columns = ['body', 'votes', 'comment_id', 'created_at', 'username'];
  let { sort_by, limit, p } = req.query;
  if (Number.isNaN(+p)) p = 1;
  if (Number.isNaN(+limit)) limit = 10;
  if (!columns.includes(sort_by)) sort_by = 'created_at';
  fetchCommentsById(req.params.article_id, {
    ...req.query,
    sort_by,
    limit,
    p,
  })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
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

exports.updateCommentById = (req, res, next) => {
  const { inc_votes } = req.body;
  // console.log(Number.isNaN(inc_votes));
  if (Number.isNaN(+inc_votes)) next({ code: 400 });
  else {
    modifyComment(req.params.article_id, req.params.comment_id, inc_votes)
      .then(([comment]) => {
        if (!comment) return Promise.reject({ status: 404, message: 'comment not found' });
        return res.status(200).send({ comment });
      })
      .catch(next);
  }
};

exports.deleteComment = (req, res, next) => {
  removeComment(req.params.article_id, req.params.comment_id)
    .then((result) => {
      // console.log(result);
      if (result.length === 0) return Promise.reject({ status: 404, message: 'article id not found' });
      return res.status(204).send(result);
    })
    .catch(next);
};
