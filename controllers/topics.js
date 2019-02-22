const {
  fetchTopics,
  postTopic,
  fetchArticlesFromTopic,
  getTotalCount,
  postArticle,
} = require('../db/models/topics');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  postTopic(req.body)
    .then(([topic]) => {
      // if (!topic) return Promise.reject({ status: 422, message: 'unprocessed' });
      res.status(201).send({ topic });
    })
    .catch(next);
};

exports.getArticlesFromTopic = (req, res, next) => {
  const columns = [
    'title',
    'votes',
    'topic',
    'article_id',
    'created_at',
    'username',
    'comment_count',
  ];
  let { sort_by, limit, p } = req.query;
  if (!columns.includes(sort_by)) sort_by = 'created_at';
  if (Number.isNaN(+p)) p = 1;
  if (Number.isNaN(+limit)) limit = 10;
  fetchArticlesFromTopic(req.params, {
    ...req.query,
    sort_by,
    limit,
    p,
  })
    .then(articles => Promise.all([getTotalCount(req.params), articles, fetchTopics()]))
    .then(([count, articles, topics]) => {
      const foundtopic = topics.find(topic => topic.slug === req.params.topic);
      if (!foundtopic) return Promise.reject({ status: 404, message: 'article not found' });
      // const { total_count } = count[0];
      const total_count = count[0] ? count[0].total_count : 0;

      return res.status(200).send({ total_count, articles });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.addArticle = (req, res, next) => {
  postArticle(req.body, req.params)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
