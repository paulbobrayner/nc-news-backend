const { fetchTopics, updateTopic } = require('../db/models/topics');

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  updateTopic(req.body)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
