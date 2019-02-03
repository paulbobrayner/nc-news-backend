const connection = require('../connection');

exports.fetchArticles = ({
  limit = 10, sort_by = 'created_at', order = 'desc', p = 1,
}) => connection
  .select(
    'articles.username as author',
    'articles.title',
    'articles.article_id',
    'articles.votes',
    'articles.created_at',
    'articles.topic',
    'articles.body',
  )
  .count({ comment_count: 'comments.comment_id' })
  .from('articles')
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .groupBy('articles.article_id')
  .limit(limit)
  .offset((p - 1) * limit)
  .orderBy(sort_by, order);

// BELOW IS BROKEN - FIX IT
exports.getTotalCount = () => connection
  .select('articles')
  .count({ total_count: 'articles' })
  .from('articles')
  .groupBy('article_id');

exports.fetchArticleById = article_id => connection
  .select(
    'articles.username as author',
    'articles.title',
    'articles.article_id',
    'articles.votes',
    'articles.created_at',
    'articles.topic',
    'articles.body',
  )
  .from('articles')
  .count({ comment_count: 'comments.article_id' })
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .groupBy('articles.article_id')
  .where('articles.article_id', '=', article_id);

exports.modifyArticle = (article_id, votes) => connection('articles')
  .where({ article_id })
  .increment('votes', votes)
  .returning('*');

exports.removeArticle = article_id => connection('articles')
  .where({ article_id })
  .del()
  .returning('*');

exports.fetchCommentsById = (
  article_id,
  {
    limit = 10, sort_by = 'created_at', p = 1, sort_ascending = 'desc',
  },
) => {
  if (sort_ascending === 'true') sort_ascending = 'asc';
  return connection
    .select(
      'comments.comment_id',
      'comments.votes',
      'comments.created_at',
      'comments.username as author',
      'comments.body',
    )
    .from('comments')
    .leftJoin('articles', 'articles.article_id', '=', 'comments.article_id')
    .limit(limit)
    .orderBy(sort_by, sort_ascending)
    .offset((p - 1) * limit)
    .where('articles.article_id', '=', article_id);
};

exports.postCommentById = (comment, { article_id }) => {
  const newComment = { ...comment, article_id };
  return (
    connection
      .insert(newComment)
      .into('comments')
      // .where('articles.article_id', '=', article_id)
      .returning('*')
  );
};

exports.modifyComment = (article_id, comment_id, votes) => connection('comments')
  .leftJoin('articles', 'articles.article_id', '=', 'comments.article_id')
  .where({ article_id })
  .where({ comment_id })
  .increment('votes', votes)
  .returning('*');

exports.removeComment = (article_id, comment_id) => connection('comments')
  .leftJoin('articles', 'articles.article_id', '=', 'comments.article_id')
  .where({ article_id })
  .where({ comment_id })
  .del()
  .returning('*');
