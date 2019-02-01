const usersRouter = require('express').Router();
const {
  getUsers,
  addUser,
  getUserByUsername,
  getArticlesByUser,
} = require('../controllers/users.js');

usersRouter
  .route('/')
  .get(getUsers)
  .post(addUser);
usersRouter.route('/:username').get(getUserByUsername);
usersRouter.route('/:username/articles').get(getArticlesByUser);

module.exports = { usersRouter };
