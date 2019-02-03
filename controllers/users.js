const {
  fetchUsers,
  postUser,
  fetchUserByUsername,
  fetchArticlesByUser,
  getTotalCount,
} = require('../db/models/users');

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.addUser = (req, res, next) => {
  // console.log(req.body);
  postUser(req.body)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  fetchUserByUsername(req.params.username).then(([user]) => {
    res.status(200).send({ user });
  });
};

exports.getArticlesByUser = (req, res, next) => {
  fetchArticlesByUser(req.params.username, req.query)
    .then(articles => Promise.all([getTotalCount(req.params.username), articles]))
    .then(([total_count, articles]) => {
      res.status(200).send({ total_count, articles });
    })
    .catch(next);
};
