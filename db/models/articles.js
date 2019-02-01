const connection = require('../connection');

exports.fetchArticles = ({
  limit = 10, sort_by = 'created_at', order = 'desc', p = 0,
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
  .count({ comment_count: 'comments.article_id' })
  .from('articles')
  .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
  .groupBy('articles.article_id')
  .limit(limit)
  .offset(p)
  .orderBy(sort_by, order);

exports.getTotalCount = () => connection
  .select('articles')
  .count({ total_count: 'articles' })
  .from('articles')
  .groupBy('articles');

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

exports.modifyArticle = (article_id, patchData) => connection('articles')
  .where({ article_id })
  .increment('articles.votes', patchData)
  .returning('*');

exports.fetchCommentsById = (article_id, { limit = 10, sort_by = 'created_at', p = 0 }) => connection
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
  .orderBy(sort_by, 'desc')
  .offset(p)
  .where('articles.article_id', '=', article_id);

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
