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

exports.fetchArticlesByUser = (
  username,
  {
    limit = 10, sort_by = 'created_at', order = 'desc', p = 1,
  },
) => connection
  .select(
    'articles.username as author',
    'articles.title',
    'articles.article_id',
    'articles.votes',
    'articles.created_at',
    'articles.topic',
  )
  .from('articles')
  .count({ comment_count: 'comments.article_id' })
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .groupBy('articles.article_id')
  .limit(limit)
  .offset((p - 1) * limit)
  .where('articles.username', '=', username)
  .orderBy(sort_by, order);

exports.getTotalCount = username => connection('articles')
  .count('article_id')
  .where('articles.username', '=', username)
  .then(([{ count }]) => count);
