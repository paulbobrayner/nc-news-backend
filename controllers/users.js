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
  fetchUserByUsername(req.params.username)
    .then(([user]) => {
      if (!user) return Promise.reject({ status: 404, message: 'comment not found' });
      return res.status(200).send({ user });
    })
    .catch(next);
};

exports.getArticlesByUser = (req, res, next) => {
  const columns = ['title', 'votes', 'topic', 'article_id', 'created_at', 'username'];
  let { sort_by, limit, p } = req.query;
  if (!columns.includes(sort_by)) sort_by = 'created_at';
  if (Number.isNaN(+p)) p = 1;
  if (Number.isNaN(+limit)) limit = 10;
  // console.log(req.params);
  fetchArticlesByUser(req.params.username, {
    ...req.query,
    sort_by,
    limit,
    p,
  })
    .then(articles => Promise.all([getTotalCount(req.params.username), articles]))
    .then(([total_count, articles]) => {
      // console.log(total_count);
      if (!articles) return Promise.reject({ status: 404, message: 'comment not found' });
      return res.status(200).send({ total_count, articles });
    })
    .catch(next);
};
