const {
  fetchTopics,
  updateTopic,
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
  // console.log(req.body);
  updateTopic(req.body)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

exports.getArticlesFromTopic = (req, res, next) => {
  fetchArticlesFromTopic(req.params, req.query)
    .then(articles => Promise.all([getTotalCount(req.params), articles]))
    .then(([total_count, articles]) => {
      // console.log(total_count, articles);
      if (total_count.length === 0) return Promise.reject({ status: 404, message: 'article not found' });
      return res.status(200).send({ total_count, articles });
    })
    .catch(next);
};

exports.addArticle = (req, res, next) => {
  // console.log(req.body);
  // console.log(req.params);
  postArticle(req.body, req.params)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
