const connection = require('../connection');

exports.fetchUsers = () => connection.select('*').from('users');

exports.postUser = user => connection
  .insert(user)
  .into('users')
  .returning('*');

exports.fetchUserByUsername = username => connection
  .select('*')
  .from('users')
  .where('users.username', '=', username);

exports.fetchArticlesByUser = username => connection
  .select(
    'articles.username as author',
    'articles.title',
    'articles.article_id',
    'articles.votes',
    'articles.created_at',
    'articles.topic',
  )
  .from('users')
  .leftJoin('articles', 'articles.username', '=', 'users.username')
  .where('users.username', '=', username);

// SELECT users.username, articles.title, articles.article_id  FROM users
// LEFT JOIN articles
// ON articles.username = users.username
// WHERE users.username = 'butter_bridge'
// ORDER BY articles.created_at DESC;
