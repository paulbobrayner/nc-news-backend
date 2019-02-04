const usersRouter = require('express').Router();
const {
  getUsers,
  addUser,
  getUserByUsername,
  getArticlesByUser,
} = require('../controllers/users.js');
const { handle405 } = require('../errors/errors');

usersRouter
  .route('/')
  .get(getUsers)
  .post(addUser)
  .all(handle405);
usersRouter.route('/:username').get(getUserByUsername);
usersRouter.route('/:username/articles').get(getArticlesByUser);

module.exports = { usersRouter };
